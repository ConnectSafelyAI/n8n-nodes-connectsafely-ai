import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export class LinkedInProfiles implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LinkedIn Profiles',
		name: 'linkedInProfiles',
		icon: 'file:linkedin.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Fetch LinkedIn profile information',
		defaults: {
			name: 'LinkedIn Profiles',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'connectSafelyApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'http://localhost:3005',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Fetch Profile',
						value: 'fetchProfile',
						description: 'Fetch detailed information about a LinkedIn profile',
						action: 'Fetch profile information',
					},
				],
				default: 'fetchProfile',
			},
			// Account ID (optional)
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				default: '',
				description: 'LinkedIn account ID (uses default if not provided)',
			},
			// Profile Parameters
			{
				displayName: 'Profile ID',
				name: 'profileId',
				type: 'string',
				default: '',
				placeholder: 'john-doe-123',
				description: 'LinkedIn profile ID (username or URL)',
				required: true,
			},
			{
				displayName: 'Include Geo Location',
				name: 'includeGeoLocation',
				type: 'boolean',
				default: false,
				description: 'Whether to include geographical location data (default: false)',
			},
			{
				displayName: 'Include Contact',
				name: 'includeContact',
				type: 'boolean',
				default: false,
				description: 'Whether to include contact information (default: false)',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Get credentials once for all operations
		const credentials = await this.getCredentials('connectSafelyApi');
		const apiKey = credentials?.apiKey as string || '';

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const operation = this.getNodeParameter('operation', itemIndex) as string;
				const accountId = this.getNodeParameter('accountId', itemIndex) as string;
				const profileId = this.getNodeParameter('profileId', itemIndex) as string;
				const includeGeoLocation = this.getNodeParameter('includeGeoLocation', itemIndex) as boolean;
				const includeContact = this.getNodeParameter('includeContact', itemIndex) as boolean;

				let responseData: any;

				switch (operation) {
					case 'fetchProfile': {
						const body: any = { 
							profileId, 
							includeGeoLocation, 
							includeContact 
						};
						if (accountId) body.accountId = accountId;

						responseData = await this.helpers.httpRequest.call(
							this,
							{
								method: 'POST',
								url: 'http://localhost:3005/linkedin/profile',
								headers: {
									'Authorization': `Bearer ${apiKey}`,
									'Content-Type': 'application/json',
									'Accept': 'application/json',
								},
								body,
								json: true,
							},
						);
						break;
					}

					default:
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
				}

				returnData.push({
					json: responseData,
					pairedItem: { item: itemIndex },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: { item: itemIndex },
					});
				} else {
					throw error;
				}
			}
		}

		return [returnData];
	}
}
