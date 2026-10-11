// Friendly explanations for the errors beginners hit most often.
const HINTS: [RegExp, string][] = [
  [/';' expected/, 'Java needs a semicolon ; at the end of each statement. Check the end of this line (or the one above).'],
  [/cannot find symbol/, "Java doesn't recognise a name here. Check the spelling and capital letters, and make sure the variable or method is declared."],
  [/incompatible types: possible lossy conversion/, 'You are putting a bigger type into a smaller one (like a double into an int). Use a cast, e.g. (int) value.'],
  [/incompatible types/, "The value's type doesn't match what Java expects here, e.g. putting a String into an int variable."],
  [/missing return statement/, 'This method promises to return a value, but some path through it never reaches a return.'],
  [/class, interface, enum, or record expected/, 'There is probably an extra or missing curly brace { } somewhere above this line.'],
  [/reached end of file while parsing/, 'A curly brace } is missing. Every { needs a matching }.'],
  [/unclosed string literal/, 'A String is missing its closing double quote ".'],
  [/'\)' expected/, 'A closing bracket ) is missing.'],
  [/not a statement/, "This line isn't a complete instruction. Did you forget a = or a method call?"],
  [/might not have been initialized/, 'Give this variable a value before you use it.'],
  [/is already defined/, 'You declared this name twice in the same place. Pick a new name or remove the type to reuse the old variable.'],
  [/cannot be applied to given types/, 'The method was called with the wrong number or types of arguments.'],
  [/non-static (method|variable)/, 'You are using an instance member from a static method. Create an object first, or make it static.'],
  [/has private access/, 'This member is private. Use a public getter or setter method instead.'],
  [/unreachable statement/, 'This line can never run, for example because it comes right after a return or break.'],
  [/duplicate class: Main/, "Don't write your own Main class here: the challenge supplies it. Just write the classes or methods it asks for."],
  [/can't find main\(String\[\]\) method in class/, 'Java runs the first class in the file. Put "public class Main" (with its main method) first.'],
  [/no class declared in source file/, 'Your code needs a class, e.g. public class Main { ... }.'],
  [/ArithmeticException: \/ by zero/, 'You divided an integer by zero, which Java does not allow.'],
  [/ArrayIndexOutOfBoundsException/, 'You used an array index that does not exist. Indexes go from 0 to length - 1.'],
  [/StringIndexOutOfBoundsException/, 'You used a character position outside the String. Positions go from 0 to length() - 1.'],
  [/NullPointerException/, 'You used something that is null (has no object yet). Make sure it was created with new or given a value.'],
  [/NumberFormatException/, "You tried to turn text into a number, but the text wasn't a valid number."],
  [/StackOverflowError/, 'A method kept calling itself forever. Check that your recursion has a base case that stops it.'],
  [/InputMismatchException/, 'The input did not match what the Scanner expected (e.g. reading a number but finding text).'],
  [/NoSuchElementException/, 'The program tried to read more input than there was.'],
  [/ClassCastException/, 'You cast an object to a type it is not.'],
];

export function friendlyHint(message: string): string | undefined {
  return HINTS.find(([re]) => re.test(message))?.[1];
}
