import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export class ConnectSafelyAnalytics implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ConnectSafely Analytics',
		name: 'connectSafelyAnalytics',
		icon: 'file:analytics.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Get detailed analytics and insights from ConnectSafely campaigns',
		defaults: {
			name: 'ConnectSafely Analytics',
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
						name: 'Export Analytics Data',
						value: 'exportAnalyticsData',
						description: 'Export analytics data in various formats',
						action: 'Export analytics data',
					},
					{
						name: 'Get Audience Insights',
						value: 'getAudienceInsights',
						description: 'Get insights about your audience demographics',
						action: 'Get audience insights',
					},
					{
						name: 'Get Campaign Performance',
						value: 'getCampaignPerformance',
						description: 'Get detailed performance metrics for a campaign',
						action: 'Get campaign performance',
					},
					{
						name: 'Get Connection Analytics',
						value: 'getConnectionAnalytics',
						description: 'Get connection growth and quality metrics',
						action: 'Get connection analytics',
					},
					{
						name: 'Get Engagement Analytics',
						value: 'getEngagementAnalytics',
						description: 'Get engagement metrics and trends',
						action: 'Get engagement analytics',
					},
					{
						name: 'Get Post Performance',
						value: 'getPostPerformance',
						description: 'Get performance metrics for specific posts',
						action: 'Get post performance',
					},
				],
				default: 'getCampaignPerformance',
			},
			// Date Range Configuration
			{
				displayName: 'Date Range',
				name: 'dateRange',
				type: 'options',
				options: [
					{
						name: 'Last 30 Days',
						value: '30d',
					},
					{
						name: 'Last 6 Months',
						value: '6m',
					},
					{
						name: 'Last 7 Days',
						value: '7d',
					},
					{
						name: 'Last 90 Days',
						value: '90d',
					},
					{
						name: 'Last Year',
						value: '1y',
					},
				],
				default: '30d',
				description: 'Time period for analytics data',
			},
			// Campaign Performance
			{
				displayName: 'Campaign ID',
				name: 'campaignId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getCampaignPerformance'],
					},
				},
				default: '',
				description: 'Campaign ID to get performance for',
				required: true,
			},
			{
				displayName: 'Include Sub-Campaigns',
				name: 'includeSubCampaigns',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getCampaignPerformance'],
					},
				},
				default: false,
				description: 'Whether to include sub-campaign performance data',
			},
			// Engagement Analytics
			{
				displayName: 'Engagement Type',
				name: 'engagementType',
				type: 'multiOptions',
				displayOptions: {
					show: {
						operation: ['getEngagementAnalytics'],
					},
				},
				options: [
					{
						name: 'Likes',
						value: 'likes',
					},
					{
						name: 'Comments',
						value: 'comments',
					},
					{
						name: 'Shares',
						value: 'shares',
					},
					{
						name: 'Connections',
						value: 'connections',
					},
				],
				default: ['likes', 'comments', 'shares'],
				description: 'Types of engagement to analyze',
			},
			// Post Performance
			{
				displayName: 'Post URLs',
				name: 'postUrls',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				displayOptions: {
					show: {
						operation: ['getPostPerformance'],
					},
				},
				default: '',
				placeholder: 'https://www.linkedin.com/posts/post1\nhttps://www.linkedin.com/posts/post2',
				description: 'LinkedIn post URLs to analyze (one per line)',
			},
			// Audience Insights
			{
				displayName: 'Insight Type',
				name: 'insightType',
				type: 'multiOptions',
				displayOptions: {
					show: {
						operation: ['getAudienceInsights'],
					},
				},
				options: [
					{
						name: 'Demographics',
						value: 'demographics',
					},
					{
						name: 'Industry',
						value: 'industry',
					},
					{
						name: 'Job Titles',
						value: 'jobTitles',
					},
					{
						name: 'Location',
						value: 'location',
					},
				],
				default: ['demographics', 'industry', 'jobTitles'],
				description: 'Types of audience insights to retrieve',
			},
			// Export Analytics Data
			{
				displayName: 'Export Format',
				name: 'exportFormat',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['exportAnalyticsData'],
					},
				},
				options: [
					{
						name: 'CSV',
						value: 'csv',
					},
					{
						name: 'JSON',
						value: 'json',
					},
					{
						name: 'Excel',
						value: 'excel',
					},
					{
						name: 'PDF Report',
						value: 'pdf',
					},
				],
				default: 'csv',
				description: 'Format to export the analytics data',
			},
			{
				displayName: 'Data Type',
				name: 'dataType',
				type: 'multiOptions',
				displayOptions: {
					show: {
						operation: ['exportAnalyticsData'],
					},
				},
				options: [
					{
						name: 'Campaign Performance',
						value: 'campaignPerformance',
					},
					{
						name: 'Engagement Data',
						value: 'engagementData',
					},
					{
						name: 'Connection Data',
						value: 'connectionData',
					},
					{
						name: 'Post Performance',
						value: 'postPerformance',
					},
				],
				default: ['campaignPerformance', 'engagementData'],
				description: 'Types of data to include in export',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const operation = this.getNodeParameter('operation', itemIndex) as string;
				const dateRange = this.getNodeParameter('dateRange', itemIndex) as string;

				let queryParams: any = {
					range: dateRange,
				};

				let responseData: any;

				switch (operation) {
					case 'getCampaignPerformance':
						const campaignId = this.getNodeParameter('campaignId', itemIndex) as string;
						const includeSubCampaigns = this.getNodeParameter('includeSubCampaigns', itemIndex) as boolean;

						queryParams.includeSubCampaigns = includeSubCampaigns;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'connectSafelyApi',
							{
								method: 'GET',
								url: `/v1/analytics/campaigns/${campaignId}/performance`,
								qs: queryParams,
							},
						);
						break;

					case 'getEngagementAnalytics':
						const engagementType = this.getNodeParameter('engagementType', itemIndex) as string[];

						queryParams.engagementTypes = engagementType;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'connectSafelyApi',
							{
								method: 'GET',
								url: '/v1/analytics/engagement',
								qs: queryParams,
							},
						);
						break;

					case 'getConnectionAnalytics':
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'connectSafelyApi',
							{
								method: 'GET',
								url: '/v1/analytics/connections',
								qs: queryParams,
							},
						);
						break;

					case 'getPostPerformance':
						const postUrls = this.getNodeParameter('postUrls', itemIndex) as string;

						queryParams.postUrls = postUrls.split('\n').map(url => url.trim());

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'connectSafelyApi',
							{
								method: 'POST',
								url: '/v1/analytics/posts/performance',
								body: queryParams,
							},
						);
						break;

					case 'getAudienceInsights':
						const insightType = this.getNodeParameter('insightType', itemIndex) as string[];

						queryParams.insightTypes = insightType;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'connectSafelyApi',
							{
								method: 'GET',
								url: '/v1/analytics/audience',
								qs: queryParams,
							},
						);
						break;

					case 'exportAnalyticsData':
						const exportFormat = this.getNodeParameter('exportFormat', itemIndex) as string;
						const dataType = this.getNodeParameter('dataType', itemIndex) as string[];

						queryParams.format = exportFormat;
						queryParams.dataTypes = dataType;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'connectSafelyApi',
							{
								method: 'POST',
								url: '/v1/analytics/export',
								body: queryParams,
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