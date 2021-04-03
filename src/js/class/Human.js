export class Human {
  constructor(name, age) {
    this.name = name;
    this.age = age
  }

  greeting() {
    return `My name is ${this.name}! ${this.age} yeads old.`;
  }

  old() {
    return this.age++;
  }
}