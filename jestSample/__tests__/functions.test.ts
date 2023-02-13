import { describe, expect, test } from '@jest/globals';
import { DatabaseMock } from "../util";
import { NameApiService } from "../nameApiService";
import { sumOfArray, asyncSumOfArray, asyncSumOfArraySometimesZero, getFirstNameThrowIfLong } from '../functions';

// todo: ここに単体テストを書いてみましょう！
test('sample test', () => {
    expect(2 + 2).toBe(4);
});

test('sumOfArray test', () => {
    let testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(sumOfArray(testArray)).toBe(55);
});

test('asyncSumOfArray test', async () => {
    let testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    await expect(asyncSumOfArray(testArray)).resolves.toBe(55);
});

test('asyncSumOfArraySometimesZero test', async () => {
    let testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const database = new DatabaseMock();
    await expect(asyncSumOfArraySometimesZero(testArray, database)).resolves.toBe(55);
});

test('asyncSumOfArraySometimesZero error test', async () => {
    class ErrorDatabaseMock extends DatabaseMock {
        save(): void {
            throw new Error('Failed to save to database');
        }
    }
    let testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const errorDatabase = new ErrorDatabaseMock();
    await expect(asyncSumOfArraySometimesZero(testArray, errorDatabase)).resolves.toBe(0);
});

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