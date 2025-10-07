import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export class LinkedInActions implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LinkedIn Actions',
		name: 'linkedInActions',
		icon: 'file:linkedin.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Perform LinkedIn actions like follow, message, and connect',
		defaults: {
			name: 'LinkedIn Actions',
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
						name: 'Follow User',
						value: 'followUser',
						description: 'Follow or unfollow a LinkedIn user',
						action: 'Follow a user',
					},
					{
						name: 'Send Message',
						value: 'sendMessage',
						description: 'Send a message to a LinkedIn user',
						action: 'Send a message',
					},
					{
						name: 'Send Connection Request',
						value: 'sendConnectionRequest',
						description: 'Send a connection request to a LinkedIn user',
						action: 'Send connection request',
					},
					{
						name: 'Check Relationship Status',
						value: 'checkRelationship',
						description: 'Check relationship status with a LinkedIn user',
						action: 'Check relationship status',
					},
				],
				default: 'followUser',
			},
			// Account ID (optional for all operations)
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
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
						operation: ['followUser', 'sendConnectionRequest', 'checkRelationship'],
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
						operation: ['followUser', 'sendConnectionRequest'],
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

				let responseData: any;

				switch (operation) {
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
