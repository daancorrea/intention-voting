interface IAuxCities {
  fileName: string;
  lastChecked: string;
}

export class AuxCities {
  constructor(
    private fileName: string,
    private lastChecked: string
  ) {}

  static create(params: IAuxCities) {
    const { fileName, lastChecked } = params;
    return new AuxCities(fileName, lastChecked);
  }

  static restore(params: IAuxCities) {
    const { fileName, lastChecked } = params;
    return new AuxCities(fileName, lastChecked);
  }

  getFileName() {
    return this.fileName;
  }
  getLastChecked() {
    return this.lastChecked;
  }

  toJSON() {
    return {
      fileName: this.fileName,
      lastChecked: this.lastChecked,
    };
  }
}
