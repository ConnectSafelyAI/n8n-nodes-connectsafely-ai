import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export class ConnectSafelyLinkedIn implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ConnectSafely LinkedIn',
		name: 'connectSafelyLinkedIn',
		icon: 'file:linkedin.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Comprehensive LinkedIn automation - actions, posts, profiles, organizations, and groups',
		defaults: {
			name: 'ConnectSafely LinkedIn',
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
			baseURL: 'https://api.connectsafely.ai',
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
						name: 'Check Relationship Status',
						value: 'checkRelationship',
						description: 'Check relationship status with a LinkedIn user',
						action: 'Check relationship status',
					},
					{
						name: 'Comment on Post',
						value: 'commentOnPost',
						description: 'Comment on a LinkedIn post',
						action: 'Comment on a post',
					},
					{
						name: 'Fetch Profile',
						value: 'fetchProfile',
						description: 'Fetch detailed information about a LinkedIn profile',
						action: 'Fetch profile information',
					},
					{
						name: 'Follow User',
						value: 'followUser',
						description: 'Follow or unfollow a LinkedIn user',
						action: 'Follow a user',
					},
					{
						name: 'Get All Post Comments',
						value: 'getAllPostComments',
						description: 'Get all comments from a LinkedIn post with automatic pagination',
						action: 'Get all post comments',
					},
					{
						name: 'Get Group Members',
						value: 'getGroupMembers',
						description: 'Fetch members of a LinkedIn group by group ID',
						action: 'Get group members',
					},
					{
						name: 'Get Group Members by URL',
						value: 'getGroupMembersByUrl',
						description: 'Fetch members of a LinkedIn group using the group URL',
						action: 'Get group members by URL',
					},
					{
						name: 'Get Latest Posts',
						value: 'getLatestPosts',
						description: 'Get the latest posts from a LinkedIn user',
						action: 'Get latest posts',
					},
					{
						name: 'Get Organizations',
						value: 'getOrganizations',
						description: 'Get all LinkedIn organizations/company pages that the user manages',
						action: 'Get organizations',
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
					{
						name: 'Send Connection Request',
						value: 'sendConnectionRequest',
						description: 'Send a connection request to a LinkedIn user',
						action: 'Send connection request',
					},
					{
						name: 'Send Message',
						value: 'sendMessage',
						description: 'Send a message to a LinkedIn user',
						action: 'Send a message',
					},
				],
				default: 'getLatestPosts',
			},
			// Account ID (optional for all operations except scrapePost)
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['followUser', 'sendMessage', 'sendConnectionRequest', 'checkRelationship', 'getLatestPosts', 'reactToPost', 'commentOnPost', 'getPostComments', 'getAllPostComments', 'searchPosts', 'fetchProfile', 'getOrganizations', 'getGroupMembers', 'getGroupMembersByUrl'],
					},
				},
				default: '',
				description: 'LinkedIn account ID (uses default if not provided)',
			},
			// Follow User Parameters
			{
				displayName: 'Profile ID',
				name: 'profileId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['followUser', 'sendConnectionRequest', 'checkRelationship', 'getLatestPosts', 'fetchProfile'],
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
						operation: ['followUser', 'sendConnectionRequest', 'getLatestPosts'],
					},
				},
				default: '',
				description: 'LinkedIn profile URN (alternative to profileId)',
			},
			{
				displayName: 'Action',
				name: 'action',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['followUser'],
					},
				},
				options: [
					{
						name: 'Follow',
						value: 'follow',
					},
					{
						name: 'Unfollow',
						value: 'unfollow',
					},
				],
				default: 'follow',
			},
			// Send Message Parameters
			{
				displayName: 'Recipient Profile ID',
				name: 'recipientProfileId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['sendMessage'],
					},
				},
				default: '',
				description: 'Recipient\'s LinkedIn profile ID',
				required: true,
			},
			{
				displayName: 'Recipient Profile URN',
				name: 'recipientProfileUrn',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['sendMessage'],
					},
				},
				default: '',
				description: 'Recipient\'s LinkedIn profile URN',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				displayOptions: {
					show: {
						operation: ['sendMessage'],
					},
				},
				default: '',
				placeholder: 'Hello! I would like to connect with you.',
				description: 'Message content',
				required: true,
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['sendMessage'],
					},
				},
				default: '',
				description: 'Message subject',
			},
			{
				displayName: 'Message Type',
				name: 'messageType',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['sendMessage'],
					},
				},
				options: [
					{
						name: 'Normal',
						value: 'normal',
					},
					{
						name: 'InMail',
						value: 'inmail',
					},
				],
				default: 'normal',
			},
			// Connection Request Parameters
			{
				displayName: 'Custom Message',
				name: 'customMessage',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				displayOptions: {
					show: {
						operation: ['sendConnectionRequest'],
					},
				},
				default: '',
				placeholder: 'Hi! I would like to connect with you.',
				description: 'Custom connection message',
			},
			// Get Latest Posts Parameters
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
			{
				displayName: 'Tag Post Author',
				name: 'tagPostAuthor',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['commentOnPost'],
					},
				},
				default: false,
				description: 'Whether to tag/mention the post author at the beginning of the comment (default: false)',
			},
			{
				displayName: 'Company URN',
				name: 'companyUrn',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['commentOnPost'],
					},
				},
				default: '',
				placeholder: 'urn:li:fsd_company:102246628',
				description: 'Company/organization URN to comment as a company page instead of personal account (optional)',
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
				default: 50,
				description: 'Number of posts to return (1-500, default: 50)',
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
			{
				displayName: 'Author Job Titles',
				name: 'authorJobTitles',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						operation: ['searchPosts'],
					},
				},
				default: [],
				placeholder: 'e.g. CEO',
				description: 'Array of job titles to filter posts by author\'s job title (max 5 titles). Examples: CEO, CTO, Founder, Director, VP.',
			},
			// Profile Parameters
			{
				displayName: 'Include Geo Location',
				name: 'includeGeoLocation',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['fetchProfile'],
					},
				},
				default: false,
				description: 'Whether to include geographical location data (default: false)',
			},
			{
				displayName: 'Include Contact',
				name: 'includeContact',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['fetchProfile'],
					},
				},
				default: false,
				description: 'Whether to include contact information (default: false)',
			},
			// LinkedIn Groups Parameters
			{
				displayName: 'Group ID',
				name: 'groupId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getGroupMembers'],
					},
				},
				default: '',
				description: 'LinkedIn group ID',
				required: true,
			},
			{
				displayName: 'Group URL',
				name: 'groupUrl',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getGroupMembersByUrl'],
					},
				},
				default: '',
				placeholder: 'https://www.linkedin.com/groups/9357376/',
				description: 'Full LinkedIn group URL',
				required: true,
			},
			{
				displayName: 'Count',
				name: 'groupCount',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getGroupMembers', 'getGroupMembersByUrl'],
					},
				},
				default: 50,
				description: 'Number of members to fetch (1-100, default: 50)',
			},
			{
				displayName: 'Start Position',
				name: 'groupStart',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getGroupMembers', 'getGroupMembersByUrl'],
					},
				},
				default: 0,
				description: 'Starting index for pagination (default: 0)',
			},
			{
				displayName: 'Membership Statuses',
				name: 'membershipStatuses',
				type: 'multiOptions',
				displayOptions: {
					show: {
						operation: ['getGroupMembers', 'getGroupMembersByUrl'],
					},
				},
				options: [
					{
						name: 'Owner',
						value: 'OWNER',
					},
					{
						name: 'Manager',
						value: 'MANAGER',
					},
					{
						name: 'Member',
						value: 'MEMBER',
					},
				],
				default: ['OWNER', 'MANAGER', 'MEMBER'],
				description: 'Filter by membership status',
			},
			{
				displayName: 'Search Query',
				name: 'typeaheadQuery',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getGroupMembers', 'getGroupMembersByUrl'],
					},
				},
				default: '',
				description: 'Search query for member names',
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
					// LinkedIn Actions Operations
					case 'followUser': {
						const profileId = this.getNodeParameter('profileId', itemIndex) as string;
						const profileUrn = this.getNodeParameter('profileUrn', itemIndex) as string;
						const action = this.getNodeParameter('action', itemIndex) as string;

						const body: any = { action };
						if (accountId) body.accountId = accountId;
						if (profileId) body.profileId = profileId;
						if (profileUrn) body.profileUrn = profileUrn;

						responseData = await this.helpers.httpRequest.call(
							this,
							{
								method: 'POST',
								url: 'https://api.connectsafely.ai/linkedin/follow',
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

					case 'sendMessage': {
						const recipientProfileId = this.getNodeParameter('recipientProfileId', itemIndex) as string;
						const recipientProfileUrn = this.getNodeParameter('recipientProfileUrn', itemIndex) as string;
						const message = this.getNodeParameter('message', itemIndex) as string;
						const subject = this.getNodeParameter('subject', itemIndex) as string;
						const messageType = this.getNodeParameter('messageType', itemIndex) as string;

						const body: any = { message };
						if (accountId) body.accountId = accountId;
						if (recipientProfileId) body.recipientProfileId = recipientProfileId;
						if (recipientProfileUrn) body.recipientProfileUrn = recipientProfileUrn;
						if (subject) body.subject = subject;
						if (messageType) body.messageType = messageType;

						responseData = await this.helpers.httpRequest.call(
							this,
							{
								method: 'POST',
								url: 'https://api.connectsafely.ai/linkedin/message',
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

					case 'sendConnectionRequest': {
						const profileId = this.getNodeParameter('profileId', itemIndex) as string;
						const profileUrn = this.getNodeParameter('profileUrn', itemIndex) as string;
						const customMessage = this.getNodeParameter('customMessage', itemIndex) as string;

						const body: any = {};
						if (accountId) body.accountId = accountId;
						if (profileId) body.profileId = profileId;
						if (profileUrn) body.profileUrn = profileUrn;
						if (customMessage) body.customMessage = customMessage;

						responseData = await this.helpers.httpRequest.call(
							this,
							{
								method: 'POST',
								url: 'https://api.connectsafely.ai/linkedin/connect',
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

					case 'checkRelationship': {
						const profileId = this.getNodeParameter('profileId', itemIndex) as string;
						
						let url = `https://api.connectsafely.ai/linkedin/relationship/${profileId}`;
						if (accountId) {
							url = `https://api.connectsafely.ai/linkedin/relationship/${accountId}/${profileId}`;
						}

						responseData = await this.helpers.httpRequest.call(
							this,
							{
								method: 'GET',
								url,
								headers: {
									'Authorization': `Bearer ${apiKey}`,
									'Content-Type': 'application/json',
									'Accept': 'application/json',
								},
								json: true,
							},
						);
						break;
					}

					// LinkedIn Posts Operations
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
								url: 'https://api.connectsafely.ai/linkedin/posts/latest',
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
								url: 'https://api.connectsafely.ai/linkedin/posts/react',
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
						const tagPostAuthor = this.getNodeParameter('tagPostAuthor', itemIndex) as boolean;
						const companyUrn = this.getNodeParameter('companyUrn', itemIndex) as string;

						const body: any = { postUrl, comment };
						if (accountId) body.accountId = accountId;
						if (tagPostAuthor !== undefined) body.tagPostAuthor = tagPostAuthor;
						if (companyUrn) body.companyUrn = companyUrn;

						responseData = await this.helpers.httpRequest.call(
							this,
							{
								method: 'POST',
								url: 'https://api.connectsafely.ai/linkedin/posts/comment',
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
								url: 'https://api.connectsafely.ai/linkedin/posts/comments',
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
								url: 'https://api.connectsafely.ai/linkedin/posts/comments/all',
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
						const authorJobTitles = this.getNodeParameter('authorJobTitles', itemIndex) as string[] | string;

						const body: any = { keywords, count: searchCount, start: searchStart, datePosted, sortBy };
						if (accountId) body.accountId = accountId;
						
						// Handle authorJobTitles - when multipleValues is true, n8n returns an array
						if (authorJobTitles) {
							let jobTitlesArray: string[] = [];
							
							if (Array.isArray(authorJobTitles)) {
								// Already an array from multipleValues
								jobTitlesArray = authorJobTitles;
							} else if (typeof authorJobTitles === 'string' && authorJobTitles.trim()) {
								// Single string value
								jobTitlesArray = [authorJobTitles];
							}
							
							// Filter out empty strings and limit to 5
							const cleanedJobTitles = jobTitlesArray
								.filter((title: string) => title && typeof title === 'string' && title.trim().length > 0)
								.slice(0, 5);
							
							if (cleanedJobTitles.length > 0) {
								body.authorJobTitles = cleanedJobTitles;
							}
						}

						responseData = await this.helpers.httpRequest.call(
							this,
							{
								method: 'POST',
								url: 'https://api.connectsafely.ai/linkedin/posts/search',
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
								url: 'https://api.connectsafely.ai/linkedin/posts/scrape',
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

					// LinkedIn Profiles Operations
					case 'fetchProfile': {
						const profileId = this.getNodeParameter('profileId', itemIndex) as string;
						const includeGeoLocation = this.getNodeParameter('includeGeoLocation', itemIndex) as boolean;
						const includeContact = this.getNodeParameter('includeContact', itemIndex) as boolean;

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
								url: 'https://api.connectsafely.ai/linkedin/profile',
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

					// LinkedIn Organizations Operations
					case 'getOrganizations': {
						let url = 'https://api.connectsafely.ai/linkedin/organizations';
						if (accountId) {
							url += `?accountId=${accountId}`;
						}

						responseData = await this.helpers.httpRequest.call(
							this,
							{
								method: 'GET',
								url,
								headers: {
									'Authorization': `Bearer ${apiKey}`,
									'Content-Type': 'application/json',
									'Accept': 'application/json',
								},
								json: true,
							},
						);
						break;
					}

					// LinkedIn Groups Operations
					case 'getGroupMembers': {
						const groupId = this.getNodeParameter('groupId', itemIndex) as string;
						const groupCount = this.getNodeParameter('groupCount', itemIndex) as number;
						const groupStart = this.getNodeParameter('groupStart', itemIndex) as number;
						const membershipStatuses = this.getNodeParameter('membershipStatuses', itemIndex) as string[];
						const typeaheadQuery = this.getNodeParameter('typeaheadQuery', itemIndex) as string;

						const body: any = { 
							groupId,
							count: groupCount,
							start: groupStart,
							membershipStatuses: membershipStatuses.length > 0 ? membershipStatuses : ['OWNER', 'MANAGER', 'MEMBER'],
						};
						if (accountId) body.accountId = accountId;
						if (typeaheadQuery) body.typeaheadQuery = typeaheadQuery;

						responseData = await this.helpers.httpRequest.call(
							this,
							{
								method: 'POST',
								url: 'https://api.connectsafely.ai/linkedin/groups/members',
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

					case 'getGroupMembersByUrl': {
						const groupUrl = this.getNodeParameter('groupUrl', itemIndex) as string;
						const groupCount = this.getNodeParameter('groupCount', itemIndex) as number;
						const groupStart = this.getNodeParameter('groupStart', itemIndex) as number;
						const membershipStatuses = this.getNodeParameter('membershipStatuses', itemIndex) as string[];
						const typeaheadQuery = this.getNodeParameter('typeaheadQuery', itemIndex) as string;

						const body: any = { 
							groupUrl,
							count: groupCount,
							start: groupStart,
							membershipStatuses: membershipStatuses.length > 0 ? membershipStatuses : ['OWNER', 'MANAGER', 'MEMBER'],
						};
						if (accountId) body.accountId = accountId;
						if (typeaheadQuery) body.typeaheadQuery = typeaheadQuery;

						responseData = await this.helpers.httpRequest.call(
							this,
							{
								method: 'POST',
								url: 'https://api.connectsafely.ai/linkedin/groups/members-by-url',
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
						`ConnectSafely LinkedIn API Error (Status: ${statusCode}): ${apiMessage}\n\nFull error details: ${fullError}`
					);
				}
			}
		}

		return [returnData];
	}
}
