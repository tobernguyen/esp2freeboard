'use strict';

module.exports = class EspMessage {
  constructor(data) {
    let dataInString = data.toString();
    if (typeof dataInString === 'string') {
      let pinValues = dataInString.split(';');

      if (pinValues.length === 12) {
        this.rawData = dataInString;
        this.parsedData = {};

        // Parse data for 11 PIN D1 to D10
        for (let i = 0; i < 11; i++) {
          this.parsedData[`PIN_D${i}`] = parseInt(pinValues[i], 10);
        }

        // Parse data for PIN A0
        this.parsedData[`PIN_A0`] = parseInt(pinValues[11], 10);
        console.log(this.parsedData);
      } else {
        throw new Error('Invalid esp data');
      }
    } else if (typeof data === 'undefined') {
      this.rawData = ';;;;;;;;;;;';
      this.parsedData = {};
    }
  }

  toJSON() {
    return this.parsedData;
  }

  toMQTTFormat() {
    return this.rawData;
  }
};
