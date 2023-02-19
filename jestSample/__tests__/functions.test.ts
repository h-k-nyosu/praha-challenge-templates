import { describe, expect, test } from '@jest/globals';
import { DatabaseMock } from "../util";
import { NameApiService } from "../nameApiService";
import { sumOfArray, asyncSumOfArray, asyncSumOfArraySometimesZero, getFirstNameThrowIfLong } from '../functions';

// todo: ここに単体テストを書いてみましょう！
test('sample test', () => {
    expect(2 + 2).toBe(4);
});

/* sumOfArray Tests */

/* 正常系テスト */
test('sumOfArray Test for a valid input with positive integers', () => {
    let testArray: number[] = [1, 2, 3, 4, 5];
    expect(sumOfArray(testArray)).toBe(15);
});

test('sumOfArray Test for a valid input with negative integers', () => {
    let testArray: number[] =  [-1, -2, -3, -4, -5];
    expect(sumOfArray(testArray)).toBe(-15);
});

test('sumOfArray Test for a valid input with a mix of positive and negative integers', () => {
    let testArray: number[] = [1, -2, 3, -4, 5];
    expect(sumOfArray(testArray)).toBe(3);
});

test('sumOfArray Test for a valid input with a single integer in the array', () => {
    let testArray: number[] = [5];
    expect(sumOfArray(testArray)).toBe(5);
});

test('sumOfArray Test for a valid input with a large array of integers', () => {
    let testArray: number[] = [100000, 200000, 300000, 400000, 500000];
    expect(sumOfArray(testArray)).toBe(1500000);
});

test('sumOfArray Test for a return 0 in the case of empty array', () => {
    let testArray: number[] = [];
    expect(() => sumOfArray(testArray)).toBe(0);
});

/* 異常系テスト */
// sumOfArrayの引数にstring型の配列を渡しているためエラーが出る。
// 型バリデーション側での責務であるためテストは行わない
// test('sumOfArray Test for a valid input with a string', () => {
//     let testArray = ['a'];
//     expect(() => sumOfArray(testArray)).toThrow(TypeError);
// });


/* asyncSumOfArray Tests */

// 正常系テスト
test('asyncSumOfArray test', async () => {
    let testArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    await expect(asyncSumOfArray(testArray)).resolves.toBe(55);
});

test('asyncSumOfArray Test for a valid input with negative integers', async () => {
    let testArray: number[] =  [-1, -2, -3, -4, -5];
    await expect(asyncSumOfArray(testArray)).resolves.toBe(-15);
});

test('asyncSumOfArray Test for a valid input with a mix of positive and negative integers', async () => {
    let testArray: number[] = [1, -2, 3, -4, 5];
    await expect(asyncSumOfArray(testArray)).resolves.toBe(3);
});

test('asyncSumOfArray Test for a valid input with a single integer in the array', async () => {
    let testArray: number[] = [5];
    await expect(asyncSumOfArray(testArray)).resolves.toBe(5);
});

test('asyncSumOfArray Test for a valid input with a large array of integers', async () => {
    let testArray: number[] = [100000, 200000, 300000, 400000, 500000];
    await expect(asyncSumOfArray(testArray)).resolves.toBe(1500000);
});

// 異常系テスト
test('asyncSumOfArray Test for a valid input with an empty array', async () => {
    let testArray: number[] = [];
    await expect(asyncSumOfArray(testArray)).rejects.toThrow(TypeError);
});

// 非同期型の関数を同期的に呼び出す場合エラーが出る
// しかしTypeScriptの静的型検査でエラーが出るためテストは行わない
// test('asyncSumOfArray Test for an usecase of sync function', () => {
//     let testArray: number[] = [1, 2, 3, 4, 5];
//     expect(asyncSumOfArray(testArray)).toBe(55);
// }):


/* asyncSumOfArraySometimesZero Tests */

// 正常系テスト
test('asyncSumOfArraySometimesZero test', async () => {
    class NotErrorDatabaseMock extends DatabaseMock {
        save(): void {
            ;
        }
    }
    let testArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const database = new NotErrorDatabaseMock();
    await expect(asyncSumOfArraySometimesZero(testArray, database)).resolves.toBe(55);
});


// 異常系テスト
test('asyncSumOfArraySometimesZero error test', async () => {
    class ErrorDatabaseMock extends DatabaseMock {
        save(): void {
            throw new Error('Failed to save to database');
        }
    }
    let testArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const errorDatabase = new ErrorDatabaseMock();
    await expect(asyncSumOfArraySometimesZero(testArray, errorDatabase)).resolves.toBe(0);
});


/* getFirstNameThrowIfLong Tests */

// 正常系テスト
test('getFirstNameThrowIfLong test', async () => {
    class NameApiServiceMock extends NameApiService {
        async getFirstName(): Promise<string> {
            return 'Taro';
        }
    };
    const nameApiService = new NameApiServiceMock();
    let maxNameLength = 5;
    await expect(getFirstNameThrowIfLong(maxNameLength, nameApiService)).resolves.toMatch(/Taro/)
});

test('getFirstNameThrowIfLong test for name is empty', async () => {
    class NameApiServiceMock extends NameApiService {
        async getFirstName(): Promise<string> {
            return '';
        }
    };
    const nameApiService = new NameApiServiceMock();
    let maxNameLength = 5;
    await expect(getFirstNameThrowIfLong(maxNameLength, nameApiService)).resolves.toMatch('')
});

// 戻り値がstring型なのでNULLを返すことはできない（素晴らしい！）
// test('getFirstNameThrowIfLong test for name is empty', async () => {
//     class NameApiServiceMock extends NameApiService {
//         async getFirstName(): Promise<string> {
//             return null;
//         }
//     };
//     const nameApiService = new NameApiServiceMock();
//     let maxNameLength = 5;
//     await expect(getFirstNameThrowIfLong(maxNameLength, nameApiService)).resolves.toMatch('')
// });

// 異常系テスト
test('getFirstNameThrowIfLong error test', async () => {
    class NameApiServiceMock extends NameApiService {
        async getFirstName(): Promise<string> {
            return 'Taro';
        }
    };
    const nameApiService = new NameApiServiceMock();
    let maxNameLength = 2;
    await expect(getFirstNameThrowIfLong(maxNameLength, nameApiService)).rejects.toThrow(/first_name too long/)
});

