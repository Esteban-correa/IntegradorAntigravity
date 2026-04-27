package com.crm.backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/kpis")
public class KpiController {

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardKpis() {
        Map<String, Object> kpis = new HashMap<>();
        kpis.put("revenue", 2400000);
        kpis.put("revenueGrowth", 12.5);
        kpis.put("customers", 12450);
        kpis.put("customersGrowth", 15.2);
        kpis.put("activeSessions", 3200);
        kpis.put("activeSessionsGrowth", 5.0);
        kpis.put("churnRate", 4.2);
        kpis.put("churnRateDelta", -0.8);
        return kpis;
    }
}
