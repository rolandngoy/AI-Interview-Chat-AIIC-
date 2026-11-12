/* =========================================================
   AI Interview Chat — simple Python coding problems
   Added to the interview for roles that involve coding.
   Each test is { args: [...], expected: ... } and is checked by pyworker.js.
   ========================================================= */
(function () {
  'use strict';

  const fizz = (n) => Array.from({ length: n }, (_, i) => { const k = i + 1; return k % 15 === 0 ? 'FizzBuzz' : k % 3 === 0 ? 'Fizz' : k % 5 === 0 ? 'Buzz' : String(k); });

  const PROBLEMS = [
    {
      title: 'Two Sum', fn: 'two_sum', args: 'nums, target',
      prompt: 'Write a function two_sum(nums, target) that returns a list of the two indices [i, j], with i < j, whose values add up to target. Exactly one pair works.',
      tests: [
        { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
        { args: [[3, 2, 4], 6], expected: [1, 2] },
        { args: [[3, 3], 6], expected: [0, 1] },
        { args: [[-1, -2, -3, -4, -5], -8], expected: [2, 4] }
      ]
    },
    {
      title: 'Palindrome Check', fn: 'is_palindrome', args: 's',
      prompt: 'Write a function is_palindrome(s) that returns True if the string reads the same forwards and backwards, ignoring case, spaces and punctuation.',
      tests: [
        { args: ['A man, a plan, a canal: Panama'], expected: true },
        { args: ['race a car'], expected: false },
        { args: [''], expected: true },
        { args: ["No 'x' in Nixon"], expected: true }
      ]
    },
    {
      title: 'FizzBuzz', fn: 'fizzbuzz', args: 'n',
      prompt: 'Write a function fizzbuzz(n) that returns a list of strings for 1 to n: "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for multiples of both, otherwise the number as a string.',
      tests: [
        { args: [1], expected: fizz(1) },
        { args: [5], expected: fizz(5) },
        { args: [15], expected: fizz(15) },
        { args: [0], expected: [] }
      ]
    },
    {
      title: 'Word Count', fn: 'count_words', args: 'text',
      prompt: 'Write a function count_words(text) that returns a dictionary of how many times each word appears. Ignore case, and treat whitespace as the separator.',
      tests: [
        { args: ['the cat and the hat'], expected: { the: 2, cat: 1, and: 1, hat: 1 } },
        { args: ['Hello hello HELLO'], expected: { hello: 3 } },
        { args: [''], expected: {} }
      ]
    },
    {
      title: 'Second Largest', fn: 'second_largest', args: 'nums',
      prompt: 'Write a function second_largest(nums) that returns the second largest distinct number in the list, or None if there are fewer than two distinct numbers.',
      tests: [
        { args: [[3, 1, 4, 1, 5]], expected: 4 },
        { args: [[2, 2, 2]], expected: null },
        { args: [[10, 9]], expected: 9 },
        { args: [[-1, -5, -3]], expected: -3 }
      ]
    },
    {
      title: 'Reverse Words', fn: 'reverse_words', args: 'sentence',
      prompt: 'Write a function reverse_words(sentence) that returns the words in reverse order, separated by single spaces, with no leading or trailing spaces.',
      tests: [
        { args: ['the sky is blue'], expected: 'blue is sky the' },
        { args: ['  hello   world  '], expected: 'world hello' },
        { args: ['a'], expected: 'a' },
        { args: [''], expected: '' }
      ]
    },
    {
      title: 'Remove Duplicates', fn: 'remove_duplicates', args: 'items',
      prompt: 'Write a function remove_duplicates(items) that returns a new list with duplicates removed, keeping the order of first appearance.',
      tests: [
        { args: [[1, 2, 2, 3, 1]], expected: [1, 2, 3] },
        { args: [[]], expected: [] },
        { args: [[5, 5, 5]], expected: [5] },
        { args: [['b', 'a', 'b', 'c', 'a']], expected: ['b', 'a', 'c'] }
      ]
    },
    {
      title: 'Valid Brackets', fn: 'is_valid', args: 's',
      prompt: 'Write a function is_valid(s) that returns True if every opening bracket in s, one of ( [ {, is closed in the correct order by the matching bracket.',
      tests: [
        { args: ['()[]{}'], expected: true },
        { args: ['(]'], expected: false },
        { args: ['([)]'], expected: false },
        { args: ['{[]}'], expected: true },
        { args: [''], expected: true }
      ]
    },
    {
      title: 'Average by Group', fn: 'average_by_group', args: 'rows', data: true,
      prompt: 'Write a function average_by_group(rows) where rows is a list of [group, value] pairs. Return a dictionary mapping each group to the average of its values, rounded to 2 decimal places.',
      tests: [
        { args: [[['a', 1], ['b', 2], ['a', 3]]], expected: { a: 2.0, b: 2.0 } },
        { args: [[['x', 10], ['x', 5], ['x', 1]]], expected: { x: 5.33 } },
        { args: [[]], expected: {} }
      ]
    },
    {
      title: 'Most Common Item', fn: 'most_common', args: 'items', data: true,
      prompt: 'Write a function most_common(items) that returns the item that appears most often in the list. If there is a tie, return the one that appears first. Return None for an empty list.',
      tests: [
        { args: [['a', 'b', 'a', 'c']], expected: 'a' },
        { args: [[1, 2, 2, 1]], expected: 1 },
        { args: [[]], expected: null },
        { args: [['x']], expected: 'x' }
      ]
    }
  ];
  PROBLEMS.forEach((p) => { p.starter = 'def ' + p.fn + '(' + p.args + '):\n    # write your solution here\n    pass\n'; });

  // Roles whose work involves writing code. Also matches roles typed in by the user.
  const CODING_ROLES = /developer|programmer|coder|software|devops|\bsre\b|data (scien|analy|engin)|machine learning|\bml\b|\bsdet\b|\bqa\b|test engineer|cloud engineer|security (engineer|analyst)|cybersecurity/i;

  window.AIIC_CODE = {
    isCodingRole: (role) => CODING_ROLES.test(role),
    pick: function (role) {
      const pool = /data (scien|analy|engin)|machine learning|\bml\b/i.test(role) ? PROBLEMS : PROBLEMS.filter((p) => !p.data);
      return pool[Math.floor(Math.random() * pool.length)];
    }
  };
})();
