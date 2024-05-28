import * as dayjs from 'dayjs'

export const formatStartTime = (time: string | undefined) => {
	if (time) {
		// this will overflow in: 5 June 2255
		// hello from 2024!
		return dayjs.unix(parseInt(time, 10)).format('DD.MM.YYYY hh:mm:ss')
	}

	return ''
}

export const formatAddress = (address: string | undefined) =>
	address ? address.slice(0, 6) + '...' + address.slice(37) : ''

export const unixToDate = (time: number) => dayjs.unix(time).toDate()
