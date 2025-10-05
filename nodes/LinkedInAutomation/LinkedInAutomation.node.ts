import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export class LinkedInAutomation implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LinkedIn Automation',
		name: 'linkedInAutomation',
		icon: 'file:linkedin.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Advanced LinkedIn automation and engagement tools',
		defaults: {
			name: 'LinkedIn Automation',
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
			baseURL: '={{ $credentials.baseUrl }}',
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
						name: 'Auto Like Posts',
						value: 'autoLike',
						description: 'Automatically like posts based on criteria',
						action: 'Auto like posts',
					},
					{
						name: 'Auto Share Posts',
						value: 'autoShare',
						description: 'Automatically share posts with comments',
						action: 'Auto share posts',
					},
					{
						name: 'Follow Users',
						value: 'followUsers',
						description: 'Follow users based on targeting criteria',
						action: 'Follow users',
					},
					{
						name: 'Get User Profile',
						value: 'getUserProfile',
						description: 'Get detailed user profile information',
						action: 'Get user profile',
					},
					{
						name: 'Search Users',
						value: 'searchUsers',
						description: 'Search for users by criteria',
						action: 'Search users',
					},
				],
				default: 'autoLike',
			},
			// Auto Like Configuration
			{
				displayName: 'Like Criteria',
				name: 'likeCriteria',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['autoLike'],
					},
				},
				options: [
					{
						name: 'By Keywords',
						value: 'keywords',
					},
					{
						name: 'By Hashtags',
						value: 'hashtags',
					},
					{
						name: 'By User',
						value: 'user',
					},
				],
				default: 'keywords',
				description: 'Criteria for selecting posts to like',
			},
			{
				displayName: 'Keywords',
				name: 'keywords',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['autoLike'],
						likeCriteria: ['keywords'],
					},
				},
				default: '',
				placeholder: 'marketing, automation, linkedin',
				description: 'Comma-separated keywords to search for',
			},
			{
				displayName: 'Hashtags',
				name: 'hashtags',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['autoLike'],
						likeCriteria: ['hashtags'],
					},
				},
				default: '',
				placeholder: '#marketing #automation #linkedin',
				description: 'Hashtags to search for (include #)',
			},
			{
				displayName: 'Target User',
				name: 'targetUser',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['autoLike'],
						likeCriteria: ['user'],
					},
				},
				default: '',
				placeholder: 'https://www.linkedin.com/in/username',
				description: 'LinkedIn profile URL to like posts from',
			},
			{
				displayName: 'Max Likes Per Day',
				name: 'maxLikesPerDay',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['autoLike'],
					},
				},
				default: 50,
				description: 'Maximum number of likes per day',
			},
			// Auto Share Configuration
			{
				displayName: 'Share Message',
				name: 'shareMessage',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				displayOptions: {
					show: {
						operation: ['autoShare'],
					},
				},
				default: '',
				placeholder: 'Great insights! Thanks for sharing.',
				description: 'Message to include when sharing',
			},
			{
				displayName: 'Share Keywords',
				name: 'shareKeywords',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['autoShare'],
					},
				},
				default: '',
				placeholder: 'leadership, innovation, growth',
				description: 'Keywords to search for posts to share',
			},
			// Follow Users Configuration
			{
				displayName: 'Follow Criteria',
				name: 'followCriteria',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['followUsers'],
					},
				},
				options: [
					{
						name: 'By Industry',
						value: 'industry',
					},
					{
						name: 'By Company',
						value: 'company',
					},
					{
						name: 'By Location',
						value: 'location',
					},
				],
				default: 'industry',
			},
			{
				displayName: 'Target Industry',
				name: 'targetIndustry',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['followUsers'],
						followCriteria: ['industry'],
					},
				},
				default: '',
				placeholder: 'Technology, Marketing, Sales',
				description: 'Industry to target',
			},
			{
				displayName: 'Target Company',
				name: 'targetCompany',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['followUsers'],
						followCriteria: ['company'],
					},
				},
				default: '',
				placeholder: 'Google, Microsoft, Apple',
				description: 'Company to target',
			},
			{
				displayName: 'Target Location',
				name: 'targetLocation',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['followUsers'],
						followCriteria: ['location'],
					},
				},
				default: '',
				placeholder: 'San Francisco, New York, London',
				description: 'Location to target',
			},
			{
				displayName: 'Max Actions Per Day',
				name: 'maxActionsPerDay',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['followUsers'],
					},
				},
				default: 20,
				description: 'Maximum number of follow actions per day',
			},
			// User Profile Operations
			{
				displayName: 'Profile URL',
				name: 'profileUrl',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getUserProfile'],
					},
				},
				default: '',
				placeholder: 'https://www.linkedin.com/in/username',
				description: 'LinkedIn profile URL to get information for',
				required: true,
			},
			// Search Configuration
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['searchUsers'],
					},
				},
				default: '',
				placeholder: 'marketing manager technology',
				description: 'Search query for users',
			},
			{
				displayName: 'Search Location',
				name: 'searchLocation',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['searchUsers'],
					},
				},
				default: '',
				placeholder: 'San Francisco Bay Area',
				description: 'Location to search in',
			},
			{
				displayName: 'Max Results',
				name: 'maxResults',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['searchUsers'],
					},
				},
				default: 50,
				description: 'Maximum number of results to return',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const operation = this.getNodeParameter('operation', itemIndex) as string;
				let responseData: any;

				switch (operation) {
					case 'autoLike':
						const likeCriteria = this.getNodeParameter('likeCriteria', itemIndex) as string;
						const maxLikesPerDay = this.getNodeParameter('maxLikesPerDay', itemIndex) as number;

						let searchParams: any = {
							maxLikesPerDay,
						};

						if (likeCriteria === 'keywords') {
							searchParams.keywords = this.getNodeParameter('keywords', itemIndex) as string;
						} else if (likeCriteria === 'hashtags') {
							searchParams.hashtags = this.getNodeParameter('hashtags', itemIndex) as string;
						} else if (likeCriteria === 'user') {
							searchParams.userUrl = this.getNodeParameter('targetUser', itemIndex) as string;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'connectSafelyApi',
							{
								method: 'POST',
								url: '/v1/automation/auto-like',
								body: searchParams,
							},
						);
						break;

					case 'autoShare':
						const shareMessage = this.getNodeParameter('shareMessage', itemIndex) as string;
						const shareKeywords = this.getNodeParameter('shareKeywords', itemIndex) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'connectSafelyApi',
							{
								method: 'POST',
								url: '/v1/automation/auto-share',
								body: {
									message: shareMessage,
									keywords: shareKeywords,
								},
							},
						);
						break;

					case 'followUsers':
						const followCriteria = this.getNodeParameter('followCriteria', itemIndex) as string;
						const maxActionsPerDay = this.getNodeParameter('maxActionsPerDay', itemIndex) as number;

						let followParams: any = {
							maxActionsPerDay,
						};

						if (followCriteria === 'industry') {
							followParams.industry = this.getNodeParameter('targetIndustry', itemIndex) as string;
						} else if (followCriteria === 'company') {
							followParams.company = this.getNodeParameter('targetCompany', itemIndex) as string;
						} else if (followCriteria === 'location') {
							followParams.location = this.getNodeParameter('targetLocation', itemIndex) as string;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'connectSafelyApi',
							{
								method: 'POST',
								url: '/v1/automation/follow-users',
								body: followParams,
							},
						);
						break;

					case 'getUserProfile':
						const profileUrl = this.getNodeParameter('profileUrl', itemIndex) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'connectSafelyApi',
							{
								method: 'GET',
								url: '/v1/users/profile',
								qs: { profileUrl },
							},
						);
						break;

					case 'searchUsers':
						const searchQuery = this.getNodeParameter('searchQuery', itemIndex) as string;
						const searchLocation = this.getNodeParameter('searchLocation', itemIndex) as string;
						const maxResults = this.getNodeParameter('maxResults', itemIndex) as number;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'connectSafelyApi',
							{
								method: 'GET',
								url: '/v1/users/search',
								qs: {
									query: searchQuery,
									location: searchLocation,
									limit: maxResults,
								},
							},
						);
						break;

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