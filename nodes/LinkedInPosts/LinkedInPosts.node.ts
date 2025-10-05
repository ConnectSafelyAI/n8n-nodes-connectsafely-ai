import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export class LinkedInPosts implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LinkedIn Posts',
		name: 'linkedInPosts',
		icon: 'file:linkedin.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with LinkedIn posts - get latest posts, react, comment, and more',
		defaults: {
			name: 'LinkedIn Posts',
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
						name: 'Comment on Post',
						value: 'commentOnPost',
						description: 'Comment on a LinkedIn post',
						action: 'Comment on a post',
					},
					{
						name: 'Get All Post Comments',
						value: 'getAllPostComments',
						description: 'Get all comments from a LinkedIn post with automatic pagination',
						action: 'Get all post comments',
					},
					{
						name: 'Get Latest Posts',
						value: 'getLatestPosts',
						description: 'Get the latest posts from a LinkedIn user',
						action: 'Get latest posts',
					},
					{
						name: 'Get Post Comments',
						value: 'getPostComments',
						description: 'Get comments from a LinkedIn post with optional pagination',
						action: 'Get post comments',
					},
					{
						name: 'React to Post',
						value: 'reactToPost',
						description: 'React to a LinkedIn post with various reaction types',
						action: 'React to a post',
					},
					{
						name: 'Scrape Post Content',
						value: 'scrapePost',
						description: 'Scrape LinkedIn post content without authentication (public posts only)',
						action: 'Scrape post content',
					},
					{
						name: 'Search Posts',
						value: 'searchPosts',
						description: 'Search for LinkedIn posts by keywords',
						action: 'Search posts',
					},
				],
				default: 'getLatestPosts',
			},
			// Account ID (optional for most operations)
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getLatestPosts', 'reactToPost', 'commentOnPost', 'getPostComments', 'getAllPostComments', 'searchPosts'],
					},
				},
				default: '',
				description: 'LinkedIn account ID (uses default if not provided)',
			},
			// Get Latest Posts Parameters
			{
				displayName: 'Profile ID',
				name: 'profileId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getLatestPosts'],
					},
				},
				default: '',
				description: 'LinkedIn profile ID',
			},
			{
				displayName: 'Profile URN',
				name: 'profileUrn',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getLatestPosts'],
					},
				},
				default: '',
				description: 'LinkedIn profile URN (alternative to profileId)',
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getLatestPosts'],
					},
				},
				default: 1,
				description: 'Number of posts to fetch (1-20, default: 1)',
			},
			{
				displayName: 'Include Reposts',
				name: 'includeReposts',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getLatestPosts'],
					},
				},
				default: true,
				description: 'Whether to include reposts/shares (default: true)',
			},
			// React to Post Parameters
			{
				displayName: 'Post URL',
				name: 'postUrl',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['reactToPost', 'commentOnPost', 'getPostComments', 'getAllPostComments', 'scrapePost'],
					},
				},
				default: '',
				placeholder: 'https://www.linkedin.com/posts/john-doe-123_...',
				description: 'LinkedIn post URL',
				required: true,
			},
			{
				displayName: 'Reaction Type',
				name: 'reactionType',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['reactToPost'],
					},
				},
				options: [
					{
						name: 'Appreciation',
						value: 'APPRECIATION',
					},
					{
						name: 'Empathy',
						value: 'EMPATHY',
					},
					{
						name: 'Entertainment',
						value: 'ENTERTAINMENT',
					},
					{
						name: 'Interest',
						value: 'INTEREST',
					},
					{
						name: 'Like',
						value: 'LIKE',
					},
					{
						name: 'Praise',
						value: 'PRAISE',
					},
				],
				default: 'LIKE',
			},
			// Comment on Post Parameters
			{
				displayName: 'Comment',
				name: 'comment',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				displayOptions: {
					show: {
						operation: ['commentOnPost'],
					},
				},
				default: '',
				placeholder: 'Great insights! Thanks for sharing.',
				description: 'Comment text',
				required: true,
			},
			// Get Post Comments Parameters
			{
				displayName: 'Comment Count',
				name: 'commentCount',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getPostComments'],
					},
				},
				default: 50,
				description: 'Number of comments per page for manual pagination (1-100)',
			},
			{
				displayName: 'Start Position',
				name: 'start',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getPostComments'],
					},
				},
				default: 0,
				description: 'Starting position for pagination (0-based)',
			},
			{
				displayName: 'Pagination Token',
				name: 'paginationToken',
				type: 'string',
				typeOptions: {
					password: true,
				},
				displayOptions: {
					show: {
						operation: ['getPostComments'],
					},
				},
				default: '',
				description: 'Pagination token from previous request',
			},
			{
				displayName: 'Max Comments',
				name: 'maxComments',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getPostComments', 'getAllPostComments'],
					},
				},
				default: 100,
				description: 'Maximum total comments when fetching all (10-5000, default: 1000)',
			},
			{
				displayName: 'Batch Size',
				name: 'batchSize',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getPostComments', 'getAllPostComments'],
					},
				},
				default: 50,
				description: 'Batch size when fetching all comments (10-100, default: 50)',
			},
			// Search Posts Parameters
			{
				displayName: 'Keywords',
				name: 'keywords',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['searchPosts'],
					},
				},
				default: '',
				placeholder: 'artificial intelligence',
				description: 'Search keywords',
				required: true,
			},
			{
				displayName: 'Count',
				name: 'searchCount',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['searchPosts'],
					},
				},
				default: 10,
				description: 'Number of posts to return (1-50, default: 10)',
			},
			{
				displayName: 'Start Position',
				name: 'searchStart',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['searchPosts'],
					},
				},
				default: 0,
				description: 'Starting position for pagination (default: 0)',
			},
			{
				displayName: 'Date Posted',
				name: 'datePosted',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['searchPosts'],
					},
				},
				options: [
					{
						name: 'Past 24 Hours',
						value: 'past-24h',
					},
					{
						name: 'Past Week',
						value: 'past-week',
					},
					{
						name: 'Past Month',
						value: 'past-month',
					},
					{
						name: 'Any Time',
						value: 'any-time',
					},
				],
				default: 'any-time',
				description: 'Date filter',
			},
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['searchPosts'],
					},
				},
				options: [
					{
						name: 'Relevance',
						value: 'relevance',
					},
					{
						name: 'Date Posted',
						value: 'date_posted',
					},
				],
				default: 'relevance',
				description: 'Sort order',
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
				const accountId = operation !== 'scrapePost' ? this.getNodeParameter('accountId', itemIndex) as string : '';

				let responseData: any;

				switch (operation) {
					case 'getLatestPosts': {
						const profileId = this.getNodeParameter('profileId', itemIndex) as string;
						const profileUrn = this.getNodeParameter('profileUrn', itemIndex) as string;
						const count = this.getNodeParameter('count', itemIndex) as number;
						const includeReposts = this.getNodeParameter('includeReposts', itemIndex) as boolean;

						const body: any = { count, includeReposts };
						if (accountId) body.accountId = accountId;
						if (profileId) body.profileId = profileId;
						if (profileUrn) body.profileUrn = profileUrn;

						responseData = await this.helpers.httpRequest.call(
							this,
							{
								method: 'POST',
								url: 'http://localhost:3005/linkedin/posts/latest',
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

					case 'reactToPost': {
						const postUrl = this.getNodeParameter('postUrl', itemIndex) as string;
						const reactionType = this.getNodeParameter('reactionType', itemIndex) as string;

						const body: any = { postUrl, reactionType };
						if (accountId) body.accountId = accountId;

						responseData = await this.helpers.httpRequest.call(
							this,
							{
								method: 'POST',
								url: 'http://localhost:3005/linkedin/posts/react',
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

					case 'commentOnPost': {
						const postUrl = this.getNodeParameter('postUrl', itemIndex) as string;
						const comment = this.getNodeParameter('comment', itemIndex) as string;

						const body: any = { postUrl, comment };
						if (accountId) body.accountId = accountId;

						responseData = await this.helpers.httpRequest.call(
							this,
							{
								method: 'POST',
								url: 'http://localhost:3005/linkedin/posts/comment',
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

					case 'getPostComments': {
						const postUrl = this.getNodeParameter('postUrl', itemIndex) as string;
						const commentCount = this.getNodeParameter('commentCount', itemIndex) as number;
						const start = this.getNodeParameter('start', itemIndex) as number;
						const paginationToken = this.getNodeParameter('paginationToken', itemIndex) as string;
						const maxComments = this.getNodeParameter('maxComments', itemIndex) as number;
						const batchSize = this.getNodeParameter('batchSize', itemIndex) as number;

						const body: any = { postUrl, maxComments, batchSize };
						if (accountId) body.accountId = accountId;
						if (commentCount) body.commentCount = commentCount;
						if (start) body.start = start;
						if (paginationToken) body.paginationToken = paginationToken;

						responseData = await this.helpers.httpRequest.call(
							this,
							{
								method: 'POST',
								url: 'http://localhost:3005/linkedin/posts/comments',
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

					case 'getAllPostComments': {
						const postUrl = this.getNodeParameter('postUrl', itemIndex) as string;
						const maxComments = this.getNodeParameter('maxComments', itemIndex) as number;
						const batchSize = this.getNodeParameter('batchSize', itemIndex) as number;

						const body: any = { postUrl, maxComments, batchSize };
						if (accountId) body.accountId = accountId;

						responseData = await this.helpers.httpRequest.call(
							this,
							{
								method: 'POST',
								url: 'http://localhost:3005/linkedin/posts/comments/all',
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

					case 'searchPosts': {
						const keywords = this.getNodeParameter('keywords', itemIndex) as string;
						const searchCount = this.getNodeParameter('searchCount', itemIndex) as number;
						const searchStart = this.getNodeParameter('searchStart', itemIndex) as number;
						const datePosted = this.getNodeParameter('datePosted', itemIndex) as string;
						const sortBy = this.getNodeParameter('sortBy', itemIndex) as string;

						const body: any = { keywords, count: searchCount, start: searchStart, datePosted, sortBy };
						if (accountId) body.accountId = accountId;

						responseData = await this.helpers.httpRequest.call(
							this,
							{
								method: 'POST',
								url: 'http://localhost:3005/linkedin/posts/search',
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

					case 'scrapePost': {
						const postUrl = this.getNodeParameter('postUrl', itemIndex) as string;

						if (!postUrl) {
							throw new NodeOperationError(this.getNode(), 'Post URL is required');
						}

						if (!postUrl.includes('linkedin.com/posts/')) {
							throw new NodeOperationError(this.getNode(), `Invalid LinkedIn post URL format. Received: "${postUrl}"`);
						}
						
						responseData = await this.helpers.httpRequest.call(
							this,
							{
								method: 'POST',
								url: 'http://localhost:3005/linkedin/posts/scrape',
								headers: {
									'Authorization': `Bearer ${apiKey}`,
									'Content-Type': 'application/json',
									'Accept': 'application/json',
								},
								body: { postUrl },
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
						json: { 
							error: error.message,
							statusCode: error.response?.status || error.statusCode || 'No status code',
							apiError: error.response?.data || null,
							details: error.description || 'No additional details available'
						},
						pairedItem: { item: itemIndex },
					});
				} else {
					// Improved error handling to show actual API errors
					const statusCode = error.response?.status || error.statusCode || 'Unknown';
					const apiMessage = error.response?.data?.message || error.response?.data?.error || error.message;
					const fullError = error.response?.data ? JSON.stringify(error.response.data, null, 2) : error.message;
					
					throw new NodeOperationError(
						this.getNode(), 
						`LinkedIn Posts API Error (Status: ${statusCode}): ${apiMessage}\n\nFull error details: ${fullError}`
					);
				}
			}
		}

		return [returnData];
	}
}