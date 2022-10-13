import { useState } from 'react'

const letters = 'ajkbidmnocdefghlpqrsvyztwxu'
const numbers = '8056219437'
const special = '&*#$%+!@=^</'

export interface ISettings {
	length: number;
	letters?: boolean;
	numbers?: boolean;
	special?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const randomSort = (array:any) => {
	array.sort(() => Math.random() * 1000 - Math.random() * 1000)
	array.sort(() => Math.random() * 1000 - Math.random() * 1000)
	array.sort(() => Math.random() * 1000 - Math.random() * 1000)
	array.sort(() => Math.random() * 1000 - Math.random() * 1000)
	array.sort(() => Math.random() * 1000 - Math.random() * 1000)

	return array
}

const toArray = (text:string) => {
	const r:string[] = []
	for (let i = 0; i < text.length; i++) r.push(text[i])
	return r
}

const isLowLetter = (letter:string):boolean => {
	return 'a'.charCodeAt(0) <= letter.charCodeAt(0) && letter.charCodeAt(0) <= 'z'.charCodeAt(0)
}

export const usePassword = () => {
	const [password, setPassword] = useState<string>('')

	const generatePassword = (settings:ISettings, length: number) => {
		let repo = ''
		if (settings.letters) repo += letters
		if (settings.numbers) repo += numbers
		if (settings.special) repo += special

		// merge the characters
		const r = randomSort(toArray(repo))

		let genPass = ''
		for (let i = 0; i < length; i++) {
			const n = Math.floor(Math.random() * 10000 % r.length)

			const char = (isLowLetter(r[n]) && Math.random() >= 0.55)
				? (r[n] as string).toUpperCase()
				: r[n]
			genPass += char
		}
		setPassword(genPass)
	}

	const generatePasswordByPhrase = (phrase:string, length:number) => {
		if (phrase.length === 0) return
		// extend the phrase
		while (phrase.length < length) {
			phrase += phrase
		}

		// take the string of the end
		const init = phrase.length - length
		phrase = phrase.substring(init)

		// create a hashes
		const BASE = 73 // prime number
		const MOD = 95471 // prime number
		const hashs = new Array<number>(length)
		for (let i = 0; i < phrase.length; i++) {
			if (i === 0) {
				hashs[i] = phrase[i].charCodeAt(0) % MOD
				continue
			}
			hashs[i] = (hashs[i - 1] * BASE + phrase[i].charCodeAt(0)) % MOD
		}

		// assign characters
		let passw = ''
		for (let i = 0; i < hashs.length; i++) {
			const rand = hashs[i] % 2
			let char = ''
			if (rand === 0) char = numbers[hashs[i] % numbers.length]
			if (rand === 1) char = letters[hashs[i] % letters.length]
			passw += char
		}

		// put some special characters
		const nrand = hashs[hashs[1] % hashs.length] % Math.floor(length / 2)
		for (let i = nrand; i < length; i += nrand) {
			const index = hashs[passw[i].charCodeAt(0) % hashs.length]
			passw = passw.substring(0, i) + special[index % special.length] + passw.substring(i + 1)
		}

		setPassword(passw)
	}


	return {
		password,
		generatePassword,
		generatePasswordByPhrase
	}
}