const AbstractCarRepository = require('../abstract-repository')
const {NonExistentCar} = require('../../error/general-errors')
const {fromDbToEntity} = require('../../car.mapper')

module.exports = class CarRepository extends AbstractCarRepository {
  /**
   * @param {import('better-sqlite3').Database} databaseAdapter
   */
  constructor(databaseAdapter) {
    super()
    this.databaseAdapter = databaseAdapter
  }

  /**
   * @param {import('../../car.entity')} car
   */
  create(car) {
    const statement = this.databaseAdapter.prepare(`
      INSERT INTO cars (
        brand,
        model,
        model_year,
        image_url,
        mileage,
        color,
        air_conditioning,
        number_passengers,
        automatic,
        price_per_week_in_cents,
        price_per_day_in_cents
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const params = [
      car.brand,
      car.model,
      car.yearOfModel,
      car.imageUrl,
      car.mileage,
      car.color,
      car.airConditioning,
      car.numberOfPassengers,
      car.automatic,
      car.pricePerWeekInCents,
      car.pricePerDayInCents,
    ]

    const queryResult = statement.run(params)

    return this.getById(queryResult.lastInsertRowid)
  }

  /**
   * @param {import('../../car.entity')} car
   */
  update(car) {
    const statement = this.databaseAdapter.prepare(`
      UPDATE cars SET
        brand = ?,
        model = ?,
        model_year = ?,
        image_url = ?,
        mileage = ?,
        color = ?,
        air_conditioning = ?,
        number_passengers = ?,
        automatic = ?,
        active = ?,
        rented = ?,
        return_date = ?,
        price_per_week_in_cents = ?,
        price_per_day_in_cents = ?
      WHERE id = ?
    `)

    const params = [
      car.brand,
      car.model,
      car.yearOfModel,
      car.imageUrl,
      car.mileage,
      car.color,
      car.airConditioning,
      car.numberOfPassengers,
      car.automatic,
      car.active,
      car.rented,
      car.returnDate,
      car.pricePerWeekInCents,
      car.pricePerDayInCents,
      car.id,
    ]

    statement.run(params)
  }

  /**
   * @param {Number} id
   */
  delete(id) {
    const statement = this.databaseAdapter.prepare(`
      DELETE FROM cars
      WHERE id = ?
    `)

    statement.run(id)
  }

  /**
   * @param {Number} id
   */
  getById(id) {
    const statement = this.databaseAdapter.prepare(`
      SELECT 
        id, 
        brand,
        model,
        model_year,
        image_url,
        mileage,
        color,
        air_conditioning,
        number_passengers,
        automatic,
        active,
        rented,
        return_date,
        price_per_week_in_cents,
        price_per_day_in_cents,
        created_at,
        updated_at
      FROM cars WHERE id = ?
    `)

    const car = statement.get(id)

    if (car) {
      return fromDbToEntity(car)
    } else {
      throw new NonExistentCar(`not found car  with id: ${id}`)
    }
  }

  getAll() {
    const statement = this.databaseAdapter.prepare(`
      SELECT
        id, 
        brand,
        model,
        model_year,
        image_url,
        mileage,
        color,
        air_conditioning,
        number_passengers,
        automatic,
        active,
        rented,
        return_date,
        price_per_week_in_cents,
        price_per_day_in_cents,
        created_at,
        updated_at
      FROM cars
    `)

    const cars = statement.all()

    return cars.map(car => fromDbToEntity(car))
  }
}
