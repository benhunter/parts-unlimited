package org.asi.partsunlimited.controllers;

import org.asi.partsunlimited.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/journey")
@Profile("journey")
public class JourneyController {

    @Autowired
    private ProductRepository repository;

    @DeleteMapping("/resetDatabase")
    public void resetDatabase() {
        repository.deleteAll();
    }

}
