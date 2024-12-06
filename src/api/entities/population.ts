interface IPopulation {
  state: string;
  cityName: string;
  population: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Population {
  private constructor(
    private state: string,
    private cityName: string,
    private population: number,
    private year: number,
    private createdAt: Date,
    private updatedAt: Date
  ) {}

  static create(params: IPopulation) {
    const { state, cityName, population, year, createdAt, updatedAt } = params;
    return new Population(
      state,
      cityName,
      population,
      year,
      createdAt,
      updatedAt
    );
  }

  static restore(params: IPopulation) {
    const { state, cityName, population, year, createdAt, updatedAt } = params;
    return new Population(
      state,
      cityName,
      population,
      year,
      createdAt,
      updatedAt
    );
  }

  getState() {
    return this.state;
  }
  getCityName() {
    return this.cityName;
  }
  getPopulation() {
    return this.population;
  }
  getYear() {
    return this.year;
  }
  getCreateAt() {
    return this.createdAt;
  }
  getUpdatedAt() {
    return this.updatedAt;
  }

  toJSON() {
    return {
      state: this.state,
      cityName: this.cityName,
      population: this.population,
      year: this.year,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
