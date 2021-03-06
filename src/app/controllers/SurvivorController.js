const { Survivor } = require("../models");
const { Inventory } = require("../models");

class SurvivorController {
  async store(req, res) {
    try {
      const inventory = await Inventory.create();

      const createSurvivor = req.body;
      createSurvivor.inventory_id = inventory.id;

      console.log(createSurvivor);
      const {
        name,
        age,
        gender,
        coordinates,
        infected,
        inventory_id
      } = await Survivor.create(createSurvivor);

      return res.json({
        name,
        age,
        gender,
        coordinates,
        infected,
        inventory_id
      });
    } catch (err) {
      console.log("err => ", err);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { coordinates } = req.body;
      const survivor = await Survivor.findByPk(id);

      if (coordinates && coordinates !== survivor.coordinates) {
        const coordinatesExists = await Survivor.findOne({
          where: { coordinates }
        });

        if (coordinatesExists) {
          return res
            .status(400)
            .json({ error: "coordinates already occupied" });
        }
      }

      const updateCoordinates = await survivor.update(req.body);

      return res.json(updateCoordinates);
    } catch (err) {
      console.log("err => ", err);
    }
  }

  async index(req, res) {
    try {
      const survivor = await Survivor.findAll({
        attributes: ["id", "name", "age", "gender", "coordinates"],
        include: {
          model: Inventory,
          as: "inventory",
          attributes: ["water", "food", "ammo"]
        }
      });
      return res.json(survivor);
    } catch (err) {
      console.log("err => ", err);
    }
  }
}
module.exports = new SurvivorController();
