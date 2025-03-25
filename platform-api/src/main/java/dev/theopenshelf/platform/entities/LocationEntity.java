package dev.theopenshelf.platform.entities;

import java.math.BigDecimal;

import dev.theopenshelf.platform.model.Location;
import dev.theopenshelf.platform.model.LocationCoordinates;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class LocationEntity {
    @Column(name = "location_name")
    private String locationName;
    private String address;

    @Embedded
    private CoordinatesEntity coordinates;

    public Location.LocationBuilder toLocation() {
        return Location.builder()
                .name(locationName)
                .address(address)
                .coordinates(coordinates != null ? LocationCoordinates.builder()
                        .lat(BigDecimal.valueOf(coordinates.getLat()))
                        .lng(BigDecimal.valueOf(coordinates.getLng()))
                        .build() : null);
    }

    public LocationEntity(Location location) {
        this.locationName = location.getName();
        this.address = location.getAddress();
        this.coordinates = new CoordinatesEntity(location.getCoordinates());
    }
}