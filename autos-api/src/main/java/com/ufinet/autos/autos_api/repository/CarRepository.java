package com.ufinet.autos.autos_api.repository;

import com.ufinet.autos.autos_api.entity.Car;
import com.ufinet.autos.autos_api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {

    // 🆕 Encontrar todos los autos de un usuario específico
    List<Car> findAllByUser(User user);

    // 🆕 Encontrar todos los autos de un usuario por ID
    List<Car> findAllByUserId(Long userId);

    // 🆕 Encontrar un auto específico que pertenezca a un usuario
    Optional<Car> findByIdAndUser(Long carId, User user);

    //Encontrar un auto específico que pertenezca a un usuario por ID
    Optional<Car> findByIdAndUserId(Long carId, Long userId);

    // Contar autos por usuario
    @Query("SELECT COUNT(c) FROM Car c WHERE c.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
}