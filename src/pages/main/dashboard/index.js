import React		from 'react'
import 'twin.macro';
import { toast } 	from 'react-toastify'

import MainLayout 	from '@components/layout/main';
import FlexTable 	from "@components/ui/elements/FlexTable"
import GoogleMaps 	from "@components/ui/elements/maps"


const Dashboard = () => {

	const countriesData = [
		{
			name: 'Kenya',
			data: [
				[
					'1',
					'Kenya',
					'Safaricom',
					'639',
					'2',
					'47',
					'3192',
					'LTE',
					'1000m'
				],
				[
					'1',
					'UG',
					'Safaricom',
					'639',
					'2',
					'47',
					'3192',
					'LTE',
					'1000m'
				]
			]
		},
		{
			name: 'Uganda',
			data: [
				[
					'1',
					'Safaricom',
					'639',
					'2',
					'47',
					'3192',
					'LTE',
					'1000m'
				],
				[
					'1',
					'Safaricom',
					'639',
					'2',
					'47',
					'3192',
					'LTE',
					'1000m'
				]
			]
		}
	]


	return (
		<MainLayout>
			<div tw='flex justify-between w-full px-10 pt-5 tracking-wide'>

				<div tw='w-1/2 pb-10 h-full mb-5'>
					<GoogleMaps />
				</div>

				<div tw='w-1/2'>
					{
						countriesData.map((entry, index) => (
							<>
								<span tw='text-xl font-semibold mb-2'>{entry.name}</span>
								<FlexTable
									showHeader
									config = {{ 
										columns	: [
											'#',
											'MNN',
											'MCC',
											'MNC',
											'LAC',
											'CID',
											'Radio Type',
											'Network Range'
										], 
										data: entry.data
									}}
								/>
							</>
						))
					}
				</div>

			</div>
		</MainLayout>
	)
}

export default Dashboard