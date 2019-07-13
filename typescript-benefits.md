# Typescript benefits

| Some Javascript experience with ES6 is recommended to understand this document

- Types make code more readable, i.e. In a function you would know immediately what arguments it takes, what value it returns, what external data it requires, etc.

```typescript
const fn = (n: number, n2: number, multiply: boolean): number => {
  return multiply ? n * n2 : n + n2;
};
```

- Intelisense: provides a massive improvement in terms of code completion and active hints as the code is added (is available on all major editors).
- Interface oriented development - easier to validate data

  ```typescript
  interface NamedPerson {
    firstName: string;
    age?: number;
    // this is when we know another property is going to come but we dont know the key
    [propName: string]: any;

    greet(lastName: string): string;
  }

  // standard interface implementation
  class Person implements NamedPerson {
    age: number = 0;
    firstName: string = '';
    lastName: string = '';

    greet(lastName: string): string {
      return lastName;
    }
  }

  // function type interface:
  interface doubleValueFunc {
    (number1: number, number2: number): number;
  }

  // extending interfaces/inheriting
  interface OldPerson extends Person {
    age: number;
  }
  ```

- Static typing is optional: This will help the compiler and show warnings about any potential errors in code, before an app is ever run. Types also help when using libraries and frameworks, as they let developers know exactly what type of data APIs expect. The key thing to remember about the type system is that it is optional. TypeScript does not force developers to add types they don’t want to add. However, as an app gets larger and more complex, types can provide some great advantages.
- Less boilerplate tests, when you are sure your variables are passedd correctly into all given places, you dont to test it as much anymore. Instead focusing on testing the real app functionality.
- Widely and extensively used; Microsoft, Google, Facebook, Airbnb, Palantir, Slack, Uber etc. Case studies links in the appendix.
- Could increase recruitment - as nowadays 80% of front end and full stack JS developers are interested in learning it. Usually when developers see that a company uses the latest and best tools in the market they would be more willing to work for that company.
- Use of generics in order to catch more bugs in the code:

```typescript
// we use generics to avoid using any, as we wouldnt be able to catch things like 27.length === undefined
function echo(data: any) {
  return data;
}

console.log(echo('hola'));
// console.log(data(25).length); <-- this wouldnt be caught unless we use generics
console.log(echo({ name: 'diego' }));

function genericEcho<T>(data: T) {
  return data;
}

console.log(genericEcho('hola'));
console.log(genericEcho(2)); // <- we would get IDE support and only available props
console.log(genericEcho<number>(3)); // <- can also pass the number im expecting

// Built in generics: Array is a generic type by default but we can also specify it
const testResultsNums: Array<number> = [1, 2, 3];
console.log(testResultsNums);

function printAll<T>(args: T[]) {
  args.forEach(e => console.log(e));
}

printAll(['hola', 'me', 'llamo', 'diego']);

// generic types: we can specify what type we are returning and curry another function
const echo2: <T>(data: T) => T = echo;
echo2('hola');

// Generic classes
class SimpleMath<T extends number | string, U extends number> {
  baseVal: T;
  multiplyVals: U;
  calculate() {
    return +this.baseVal * +this.multiplyVals; // + operator before variable returns the numeric representation of the object
  }
}

// we should specify the Type that we are expecting otherwise we wouldnt get any errors
const sm = new SimpleMath<string, number>();
sm.baseVal = '10';
sm.multiplyVals = 3;
console.log(sm.calculate());
```

## Cons of using Typescript

- Set up is more difficult, and need to configure a ts-config file
- Requires a compilation step - although nowadays everyone writes ES6+ and transpiles back to ES5 most of the time, or whichever node version is supported in that environment.

## Apendix

- [Slack Typescript case study](https://slack.engineering/typescript-at-slack-a81307fa288d)
- [Typescript at Lyft](https://eng.lyft.com/typescript-at-lyft-64f0702346ea)
- [Bad excuses for not using TS](https://blog.logrocket.com/7-bad-excuses-for-not-using-typescript-dbf5e603a9a8/)
- [Why TypeScript is the best way to write Front-end in 2019](https://medium.com/@jtomaszewski/why-typescript-is-the-best-way-to-write-front-end-in-2019-feb855f9b164)
