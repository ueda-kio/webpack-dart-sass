import {Human} from './class/Human';
import '../scss/app.scss'

const kio = new Human('uedakio', 25);
const greet = kio.greeting();
console.log(greet);

const humans = [
  {
    name: 'kio',
    age: 25,
    tall: 168
  },
  {
    name: 'tanaka',
    age: 24,
    tall: 178
  },
  {
    name: 'Michel Long',
    age: 78,
    tall: 205
  }
]

const call = () => {
  for(const human of humans) {
    console.log(human.name);
    console.log(human.age);
  }
}

call();