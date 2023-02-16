//! # A Concordium V1 smart contract
use concordium_std::*;
use core::fmt::Debug;

/// Your smart contract state.
#[derive(Serialize, SchemaType, Clone)]
pub struct State {
}

/// Init function that creates a new smart contract.
#[init(contract = "frndz")]
fn init<S: HasStateApi>(
    _ctx: &impl HasInitContext,
    _state_builder: &mut StateBuilder<S>,
) -> InitResult<State> {
    
    Ok(State {
    })
}

/// Your smart contract errors.
#[derive(Debug, PartialEq, Eq, Reject, Serial, SchemaType)]
enum Error {
    /// Failed parsing the parameter.
    #[from(ParseError)]
    ParseParamsError,
    ContractAddressNotAllowed,
}

#[receive(
    contract = "frndz",
    name = "load",
    error = "Error",
    mutable,
    payable
)]
fn load<S: HasStateApi>(
    _ctx: &impl HasReceiveContext,
    _host: &mut impl HasHost<State, StateApiType = S>,
    _amount: Amount,
) -> Result<(), Error> {
    Ok(())
}

#[derive(Serialize, SchemaType)]
struct ClaimParameter {
    amount_to_claim: Amount,
}

/// View function that returns the content of the RewardView.
#[receive(contract = "frndz", name = "claimreward", mutable, error = "Error", parameter = "ClaimParameter")]
fn claimreward<S: HasStateApi>(
    ctx: &impl HasReceiveContext,
    host: &impl HasHost<State, StateApiType = S>,
) -> Result<(), Error> {
    let sender = match ctx.sender() {
        Address::Account(acc) => acc,
        Address::Contract(_) => return Err(Error::ContractAddressNotAllowed),
    };
    let claim_parameter: ClaimParameter = ctx.parameter_cursor().get()?;

    let _res = host.invoke_transfer(&sender, claim_parameter.amount_to_claim);
    Ok(())
}

#[concordium_cfg_test]
mod tests {
    use super::*;
    use test_infrastructure::*;

    const ACC: AccountAddress = AccountAddress([0u8; 32]);

    #[test]
    fn test_load() {
        // Init
        let ctx = TestInitContext::empty();

        let mut state_builder = TestStateBuilder::new();

        // Initializing state
        let initial_state = init(&ctx, &mut state_builder).expect("Initialization should pass");

        // arrange
        let mut ctx = TestReceiveContext::empty();
        ctx.set_sender(Address::Account(ACC));
        let amount = Amount::from_micro_ccd(1000);

        let mut host = TestHost::new(initial_state, state_builder);
        host.set_self_balance(amount);
        // act
        let result = load(&ctx, &mut host, amount);
        let balance = host.self_balance();
        // assert
        assert!(result.is_ok(), "Inserting CCD results in error");
        assert_eq!(balance, Amount::from_micro_ccd(1000));
    }

    #[test]
    fn test_claimreward() {
        // Init
        let ctx = TestInitContext::empty();

        let mut state_builder = TestStateBuilder::new();

        // Initializing state
        let initial_state = init(&ctx, &mut state_builder).expect("Initialization should pass");

        // arrange
        let mut ctx = TestReceiveContext::empty();
        ctx.set_sender(Address::Account(ACC));

        let amount_to_claim = Amount::from_micro_ccd(700);
        let parameter = to_bytes(&amount_to_claim);
        ctx.set_parameter(&parameter);
        
        let mut host = TestHost::new(initial_state, state_builder);
        // act
        let amount = Amount::from_micro_ccd(1000);
        host.set_self_balance(amount);
        load(&ctx, &mut host, amount);
        
        let result = claimreward(&ctx, &mut host);
        let balance = host.self_balance();
        // assert
        assert!(result.is_ok(), "Inserting CCD results in error");
        assert_eq!(balance, Amount::from_micro_ccd(300));
    }
}
