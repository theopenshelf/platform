package dev.theopenshelf.platform.entities;

import java.util.HashMap;
import java.util.Map;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class CoordinatesEntity {
    private Double lat;
    private Double lng;

    public Map<String, Double> toCoordinates() {
        Map<String, Double> coordinates = new HashMap<>();
        coordinates.put("lat", lat);
        coordinates.put("lng", lng);
        return coordinates;
    }
}