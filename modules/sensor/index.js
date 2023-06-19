module.exports = class Sensor {
    constructor(lettura) {
      this.id = lettura.id;
      this.temp = lettura.temp;
      this.press = lettura.press;
      this.hum = lettura.hum;
      this.gas = lettura.gas;
      // 4. Aggiungere in lettura una nuovo parametro, chiamato lasttime che deve essere uguale al timestamp in secondi di quanto si riceve in lettura
      this.lasttime = Date.now() / 1000;
    }
    print() {
        console.log('The sensor node', this.id, 'at second', this.lasttime, 'have temperature', this.temp, 'pressure', this.press, 'humidity', this.hum, 'and gas', this.gas);
    }
    update(lettura){
      this.temp = lettura.temp;
      this.press = lettura.press;
      this.hum = lettura.hum;
      this.gas = lettura.gas;
      this.lasttime = Date.now() / 1000;
    }
  }