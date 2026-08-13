package com.farmmanagement.dto;

public class StatCardDto {
    private String id;
    private String title;
    private String value;
    private String change;
    private String trend;
    private String subtitle;

    public StatCardDto() {}

    public StatCardDto(String id, String title, String value, String change, String trend, String subtitle) {
        this.id = id;
        this.title = title;
        this.value = value;
        this.change = change;
        this.trend = trend;
        this.subtitle = subtitle;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
    public String getChange() { return change; }
    public void setChange(String change) { this.change = change; }
    public String getTrend() { return trend; }
    public void setTrend(String trend) { this.trend = trend; }
    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
}
