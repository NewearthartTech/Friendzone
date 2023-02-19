import { ArrowDownward } from "@mui/icons-material";
import { Card, CardContent, Typography } from "@mui/material";
import React from "react";

const FeatureCard = ({ title, description, onClick }: { title: string, description: string, onClick?: () => any }) => (
    <Card variant="elevation" onClick={onClick} sx={{ textAlign: "center", cursor: onClick ? "pointer" : "auto" }}>
        <CardContent>
            <Typography>
                {title}
            </Typography>
            <Typography sx={{ maxWidth: "14rem" }}>
                {description}
            </Typography>
            <ArrowDownward color="primary" sx={{ mt: 4 }} />
        </CardContent>
    </Card>
)
export default FeatureCard;