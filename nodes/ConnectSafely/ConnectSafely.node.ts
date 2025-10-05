import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export class ConnectSafely implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ConnectSafely',
		name: 'connectSafely',
		icon: 'file:connectsafely.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Automate LinkedIn engagement with ConnectSafely',
		defaults: {
			name: 'ConnectSafely',
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
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Post',
						value: 'post',
					},
					{
						name: 'Comment',
						value: 'comment',
					},
					{
						name: 'Connection',
						value: 'connection',
					},
					{
						name: 'Analytics',
						value: 'analytics',
					},
				],
				default: 'post',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['post'],
					},
				},
				options: [
					{
						name: 'Boost Post',
						value: 'boost',
						description: 'Boost a LinkedIn post for more engagement',
						action: 'Boost a post',
					},
					{
						name: 'Get Post Analytics',
						value: 'getAnalytics',
						description: 'Get analytics for a specific post',
						action: 'Get analytics for a post',
					},
				],
				default: 'boost',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['comment'],
					},
				},
				options: [
					{
						name: 'Auto Comment',
						value: 'autoComment',
						description: 'Automatically comment on posts',
						action: 'Auto comment on posts',
					},
				],
				default: 'autoComment',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['connection'],
					},
				},
				options: [
					{
						name: 'Send Connection Request',
						value: 'sendRequest',
						description: 'Send a LinkedIn connection request',
						action: 'Send a connection request',
					},
				],
				default: 'sendRequest',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['analytics'],
					},
				},
				options: [
					{
						name: 'Get Profile Analytics',
						value: 'getProfileAnalytics',
						description: 'Get analytics for your LinkedIn profile',
						action: 'Get profile analytics',
					},
				],
				default: 'getProfileAnalytics',
			},
			// Post Operations
			{
				displayName: 'Post URL',
				name: 'postUrl',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['boost', 'getAnalytics'],
					},
				},
				default: '',
				placeholder: 'https://www.linkedin.com/posts/...',
				description: 'The LinkedIn post URL to boost or get analytics for',
				required: true,
			},
			{
				displayName: 'Boost Duration (Hours)',
				name: 'boostDuration',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['boost'],
					},
				},
				default: 24,
				description: 'How long to boost the post in hours',
			},
			{
				displayName: 'Boost Budget',
				name: 'boostBudget',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['boost'],
					},
				},
				default: 10,
				description: 'Budget for boosting the post',
			},
			// Comment Operations
			{
				displayName: 'Comment Text',
				name: 'commentText',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				displayOptions: {
					show: {
						resource: ['comment'],
						operation: ['autoComment'],
					},
				},
				default: '',
				placeholder: 'Great post! Thanks for sharing.',
				description: 'The comment text to post',
				required: true,
			},
			{
				displayName: 'Target Post URL',
				name: 'targetPostUrl',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['comment'],
						operation: ['autoComment'],
					},
				},
				default: '',
				placeholder: 'https://www.linkedin.com/posts/...',
				description: 'The LinkedIn post URL to comment on',
				required: true,
			},
			// Connection Operations
			{
				displayName: 'Profile URL',
				name: 'profileUrl',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['connection'],
						operation: ['sendRequest'],
					},
				},
				default: '',
				placeholder: 'https://www.linkedin.com/in/...',
				description: 'The LinkedIn profile URL to send connection request to',
				required: true,
			},
			{
				displayName: 'Connection Message',
				name: 'connectionMessage',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				displayOptions: {
					show: {
						resource: ['connection'],
						operation: ['sendRequest'],
					},
				},
				default: '',
				placeholder: 'Hi! I would like to connect with you.',
				description: 'Personal message to include with the connection request',
			},
			// Analytics Operations
			{
				displayName: 'Date Range',
				name: 'dateRange',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['analytics'],
					},
				},
				options: [
					{
						name: 'Last 7 Days',
						value: '7d',
					},
					{
						name: 'Last 30 Days',
						value: '30d',
					},
					{
						name: 'Last 90 Days',
						value: '90d',
					},
				],
				default: '30d',
				description: 'The date range for analytics',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const resource = this.getNodeParameter('resource', itemIndex) as string;
				const operation = this.getNodeParameter('operation', itemIndex) as string;

				let responseData: any;

				if (resource === 'post') {
					if (operation === 'boost') {
						const postUrl = this.getNodeParameter('postUrl', itemIndex) as string;
						const boostDuration = this.getNodeParameter('boostDuration', itemIndex) as number;
						const boostBudget = this.getNodeParameter('boostBudget', itemIndex) as number;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'connectSafelyApi',
							{
								method: 'POST',
								url: '/v1/posts/boost',
								body: {
									postUrl,
									duration: boostDuration,
									budget: boostBudget,
								},
							},
						);
					} else if (operation === 'getAnalytics') {
						const postUrl = this.getNodeParameter('postUrl', itemIndex) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'connectSafelyApi',
							{
								method: 'GET',
								url: `/v1/posts/analytics`,
								qs: { postUrl },
							},
						);
					}
				} else if (resource === 'comment') {
					if (operation === 'autoComment') {
						const commentText = this.getNodeParameter('commentText', itemIndex) as string;
						const targetPostUrl = this.getNodeParameter('targetPostUrl', itemIndex) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'connectSafelyApi',
							{
								method: 'POST',
								url: '/v1/comments/create',
								body: {
									postUrl: targetPostUrl,
									comment: commentText,
								},
							},
						);
					}
				} else if (resource === 'connection') {
					if (operation === 'sendRequest') {
						const profileUrl = this.getNodeParameter('profileUrl', itemIndex) as string;
						const connectionMessage = this.getNodeParameter('connectionMessage', itemIndex) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'connectSafelyApi',
							{
								method: 'POST',
								url: '/v1/connections/send',
								body: {
									profileUrl,
									message: connectionMessage,
								},
							},
						);
					}
				} else if (resource === 'analytics') {
					if (operation === 'getProfileAnalytics') {
						const dateRange = this.getNodeParameter('dateRange', itemIndex) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'connectSafelyApi',
							{
								method: 'GET',
								url: '/v1/analytics/profile',
								qs: { range: dateRange },
							},
						);
					}
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
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