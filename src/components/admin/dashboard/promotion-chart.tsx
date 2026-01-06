"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { ChartTooltipContent, ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { useMemo } from "react";
import { type Inscription } from "@/components/registration-form";

const chartConfig = {
    lic1: { label: "LIC1", color: "hsl(var(--chart-1))" },
    lic2: { label: "LIC2", color: "hsl(var(--chart-2))" },
    lrt: { label: "LRT", color: "hsl(var(--chart-3))" },
    lrt2: { label: "LRT 2", color: "hsl(var(--chart-4))" },
    other: { label: "Other", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig

const groupInscriptionsByClasse = (inscriptions: Inscription[]) => {
    const groups: Record<string, number> = {
        lic1: 0,
        lic2: 0,
        lrt: 0,
        lrt2: 0,
        other: 0,
    };

    inscriptions.forEach(inscription => {
        const classe = inscription.classe.toLowerCase().replace(/ /g, '');
        if (classe.includes('lic1')) groups.lic1++;
        else if (classe.includes('lic2')) groups.lic2++;
        else if (classe.includes('lrt2')) groups.lrt2++;
        else if (classe.includes('lrt')) groups.lrt++;
        else groups.other++;
    });

    return Object.entries(groups).map(([name, value]) => ({
        name: chartConfig[name as keyof typeof chartConfig].label,
        value,
        fill: `var(--color-${name})`
    }));
};

export default function PromotionChart({ inscriptions }: { inscriptions: Inscription[] }) {
    const data = useMemo(() => groupInscriptionsByClasse(inscriptions), [inscriptions]);
    const totalParticipants = inscriptions.length;

    return (
        <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-lg h-full">
            <CardHeader>
                <CardTitle>Répartition par Promotion</CardTitle>
                <CardDescription>Visualisation des participants par classe</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] relative">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <PieChart>
                            <Tooltip
                                content={<ChartTooltipContent />}
                                wrapperStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: 'var(--radius)',
                                    color: 'hsl(var(--foreground))',
                                }}
                            />
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                innerRadius="60%"
                                outerRadius="80%"
                                dataKey="value"
                                nameKey="name"
                                stroke="hsl(var(--background))"
                                strokeWidth={4}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-bold font-headline">{totalParticipants}</span>
                        <span className="text-sm text-muted-foreground">Participants</span>
                    </div>
                </div>
                 <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs">
                    {data.filter(d => d.value > 0).map((entry) => {
                       const configKey = Object.keys(chartConfig).find(key => chartConfig[key as keyof typeof chartConfig].label === entry.name);
                       if(!configKey) return null;
                       const config = chartConfig[configKey as keyof typeof chartConfig];
                       
                        return (
                            <div key={entry.name} className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }}></span>
                                <span>{config.label} ({entry?.value})</span>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
