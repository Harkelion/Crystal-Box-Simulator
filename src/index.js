function runSimulation() {
  const whiteBoxChance = parseInt(
    document.getElementById("whiteBoxChance").value
  );
  const greenBoxChance = parseInt(
    document.getElementById("greenBoxChance").value
  );
  const rarityBox = document.getElementById("rarityBox").value;
  const numberIteration = parseInt(
    document.getElementById("numberIteration").value
  );
  function createDesiredPropertiesArray() {
    const weaponOptions = document.querySelectorAll(
      ".weapon-properties select"
    );
    const armorOptions = document.querySelectorAll(".armor-properties select");

    const selectedWeaponOptions = Array.from(weaponOptions)
      .map((select) => select.value)
      .filter((value) => value !== "none");

    const selectedArmorOptions = Array.from(armorOptions)
      .map((select) => select.value)
      .filter((value) => value !== "none");

    return [...selectedWeaponOptions, ...selectedArmorOptions];
  }

  const desiredProperties = createDesiredPropertiesArray();

  // Function to generate a random number between min (inclusive) and max (exclusive)
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  let purpleCrystals = [];

  const Type50_50 = true;

  // Possible crystal types
  const crystalTypes = ["Weapon", "Armor"];

  // Properties of crystals of type Weapon
  const weaponProperties = [
    "Bitter",
    "Swift",
    "Titanic",
    "Forceful",
    "Carving",
    "Infused",
    "Relentless",
    "Cunning",
    "Salivating",
    "Pounding",
    "Wrathful",
    "Furious"
  ];

  // Properties of crystals of type Armor
  const armorProperties = ["Shielding", "Sneaking", "Confronting"];

  // Possible rarities of crystals
  const rarities = ["White", "Green", "Blue", "Yellow", "Purple"];

  // Purple crystals obtained
  let purpleToken = 0;

  function createCrystalCombinations() {
    const combinations = {};

    for (const rarity of rarities) {
      for (const type of crystalTypes) {
        const properties =
          type === "Weapon" ? weaponProperties : armorProperties;

        for (const property of properties) {
          const key = `${type}-${property}-${rarity}`;
          combinations[key] = 0;
        }
      }
    }

    return combinations;
  }

  // Build inventory
  let inventory = createCrystalCombinations();

  // Function to open the box and update the combinations
  function openBox(rarity, lucky) {
    let type;
    if (Type50_50) {
      // Select a random crystal type
      type = crystalTypes[getRandomInt(0, crystalTypes.length)];
    } else {
      type =
        getRandomInt(0, weaponProperties.length + armorProperties.length) <
        weaponProperties.length
          ? crystalTypes[0]
          : crystalTypes[1];
    }

    // Chances of getting 1 purple token instead of a crystal
    if (
      rarity == "White" &&
      getRandomInt(1, whiteBoxChance + 1) == 1 &&
      lucky
    ) {
      return purpleToken++;
    } else if (
      rarity == "Green" &&
      getRandomInt(1, greenBoxChance + 1) == 1 &&
      lucky
    ) {
      return purpleToken++;
    }

    if (type === "Weapon") {
      // If it's a crystal of type Weapon, select a random property
      const property =
        weaponProperties[getRandomInt(0, weaponProperties.length)];

      // Update the combination count
      const key = `${type}-${property}-${rarity}`;
      inventory[key]++;

      return { type, property, rarity };
    } else if (type === "Armor") {
      // If it's a crystal of type Armor, select a random property
      const property = armorProperties[getRandomInt(0, armorProperties.length)];

      // Update the combination count
      const key = `${type}-${property}-${rarity}`;
      inventory[key]++;

      return { type, property, rarity };
    } else {
      console.log("Invalid crystal type.");
    }
  }

  function upgradeRarities() {
    for (const rarity of rarities) {
      if (rarity === "Purple") continue;
      for (const property of desiredProperties) {
        if (alreadyPurpleCrystals(property)) continue;
        const key = `Weapon-${property}-${rarity}`;
        if (inventory[key] >= 3) {
          const propertyIndex = weaponProperties.indexOf(property);
          const rarityIndex = rarities.indexOf(rarity);

          // Check if there's a higher rarity to upgrade to
          if (rarityIndex < rarities.length - 1) {
            const higherRarity = rarities[rarityIndex + 1];
            const higherKey = `Weapon-${property}-${higherRarity}`;

            // Upgrade the higher rarity
            inventory[higherKey]++;
          }

          // Decrease the current rarity
          inventory[key] -= 3;

          // Check if the current property reached "Purple" rarity
          if (rarities[rarityIndex + 1] === "Purple") {
            const propertyToAdd =
              property.substring(0, 1).toUpperCase() + property.substring(1);
            purpleCrystals.push(propertyToAdd);
          }
        }
      }
    }

    // Repeat the same process for Armor properties
    for (const rarity of rarities) {
      if (rarity === "Purple") continue;
      for (const property of desiredProperties) {
        if (alreadyPurpleCrystals(property)) continue;
        const key = `Armor-${property}-${rarity}`;
        if (inventory[key] >= 3) {
          const propertyIndex = armorProperties.indexOf(property);
          const rarityIndex = rarities.indexOf(rarity);

          // Check if there's a higher rarity to upgrade to
          if (rarityIndex < rarities.length - 1) {
            const higherRarity = rarities[rarityIndex + 1];
            const higherKey = `Armor-${property}-${higherRarity}`;

            // Upgrade the higher rarity
            inventory[higherKey]++;
          }

          // Decrease the current rarity
          inventory[key] -= 3;

          // Check if the current property reached "Purple" rarity
          if (rarities[rarityIndex + 1] === "Purple") {
            const propertyToAdd =
              property.substring(0, 1).toUpperCase() + property.substring(1);
            purpleCrystals.push(propertyToAdd);
          }
        }
      }
    }
  }

  function fuseUndesiredCrystals() {
    function getRandomProperty(properties) {
      return properties[getRandomInt(0, properties.length)];
    }

    for (const rarity of rarities) {
      if (rarity === "Purple") continue; // Skip upgrades for Purple rarity

      for (const type of crystalTypes) {
        const properties =
          type === "Weapon" ? weaponProperties : armorProperties;
        const undesiredCrystals = [];
        let totalUndesired = 0;

        // Collect undesired crystals and calculate their total count
        for (const property of properties) {
          const key = `${type}-${property}-${rarity}`;
          if (
            desiredProperties.indexOf(property) === -1 ||
            alreadyPurpleCrystals(property)
          ) {
            undesiredCrystals.push(key);
            totalUndesired += inventory[key];
          }
        }

        // Apply upgrades if total count is 3 or more
        if (totalUndesired >= 3) {
          let removed = 0;

          for (const key of undesiredCrystals) {
            if (removed >= 3) break; // Limit reached, stop removing crystals

            const count = inventory[key];
            if (count > 0) {
              const decrement = Math.min(3 - removed, count);
              // console.log(`-${decrement} : ` + key);
              inventory[key] -= decrement;
              removed += decrement;
            }
          }

          // Generate a new crystal if necessary
          if (removed === 3) {
            const newProperty = getRandomProperty(properties);
            const newKey = `${type}-${newProperty}-${rarity}`;
            // console.log("+1 : " + newKey);
            inventory[newKey]++;
          }
        }
      }
    }
  }

  function alreadyPurpleCrystals(property) {
    const countInDesiredProperties = desiredProperties.filter(
      (prop) => prop === property
    ).length;
    const countInPurpleCrystals = purpleCrystals.filter(
      (prop) => prop === property
    ).length;

    return countInPurpleCrystals == countInDesiredProperties;
  }

  let totalBox = 0;
  let totalToken = 0;
  let boxOpen = 0;

  // for (let i = 0; i < numberIteration; i++) {
  //   // console.log(openBox(rarityBox, true));
  //   openBox(rarityBox, true);
  //   fuseUndesiredCrystals();
  //   upgradeRarities();
  //   boxOpen++;
  // }

  for (let i = 0; i < numberIteration; i++) {
    boxOpen = 0;
    purpleCrystals = [];
    purpleToken = 0;
    inventory = createCrystalCombinations();
    while (desiredProperties.length > purpleCrystals.length + purpleToken) {
      // console.log(openBox(rarityBox, true));
      openBox(rarityBox, true);
      fuseUndesiredCrystals();
      upgradeRarities();
      boxOpen++;
    }
    totalBox += boxOpen;
    totalToken += purpleToken;
  }

  // console.log(inventory);
  // console.log(
  //   "Average number of box Open : " + Math.floor(totalBox / numberIteration)
  // );
  // console.log(
  //   "Average number of purple token : " +
  //     Math.floor(totalToken / numberIteration)
  // );

  const averageBoxOpen = Math.floor(totalBox / numberIteration);
  const averagePurpleToken = Math.floor(totalToken / numberIteration);

  document.getElementById("averageBoxOpen").textContent =
    "Average number of box open: " + averageBoxOpen;
  document.getElementById("averagePurpleToken").textContent =
    "Average number of purple tokens: " + averagePurpleToken;
}

const button = document.querySelector("button[onclick='runSimulation()']");
button.onclick = runSimulation;
