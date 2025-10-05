# ConnectSafely N8N Nodes

A comprehensive N8N community node package for [ConnectSafely.ai](https://connectsafely.ai) - the leading LinkedIn automation platform. This package provides powerful nodes to automate your LinkedIn engagement, manage posts, and grow your professional network.

## 🚀 Features

### LinkedIn Actions Node
- **Follow/Unfollow Users**: Follow or unfollow LinkedIn users
- **Send Messages**: Send direct messages to LinkedIn users
- **Send Connection Requests**: Send connection requests with custom messages
- **Check Relationship Status**: Check your relationship status with other users

### LinkedIn Posts Node
- **Get Latest Posts**: Fetch the latest posts from LinkedIn users
- **React to Posts**: React to posts with various reaction types (Like, Praise, etc.)
- **Comment on Posts**: Comment on LinkedIn posts
- **Get Post Comments**: Retrieve comments from posts with pagination
- **Search Posts**: Search for posts by keywords with filters
- **Scrape Post Content**: Scrape public post content without authentication

### LinkedIn Profiles Node
- **Fetch Profile Information**: Get detailed profile information including experience, education, and contact details
- **Include Geo Location**: Option to include geographical location data
- **Include Contact Info**: Option to include contact information

## 📦 Installation

1. Install the package in your N8N instance:
   ```bash
   npm install n8n-nodes-connectsafely
   ```

2. Restart your N8N instance to load the new nodes.

3. Configure your ConnectSafely API credentials in N8N.

## 🔧 Setup

### 1. Get ConnectSafely API Credentials

1. Sign up at [ConnectSafely.ai](https://connectsafely.ai)
2. Navigate to your API settings
3. Generate an API key
4. Note your API base URL (usually `https://api.connectsafely.ai`)

### 2. Configure Credentials in N8N

1. In N8N, go to **Credentials** → **Add Credential**
2. Search for "ConnectSafely API"
3. Enter your API key and base URL
4. Test the connection

## 📖 Usage Examples

### Boost a LinkedIn Post

```json
{
  "resource": "post",
  "operation": "boost",
  "postUrl": "https://www.linkedin.com/posts/your-post-url",
  "boostDuration": 24,
  "boostBudget": 10
}
```

### Auto Comment on Posts

```json
{
  "resource": "comment",
  "operation": "autoComment",
  "targetPostUrl": "https://www.linkedin.com/posts/target-post",
  "commentText": "Great insights! Thanks for sharing."
}
```

### Get Campaign Analytics

```json
{
  "operation": "getCampaignPerformance",
  "campaignId": "your-campaign-id",
  "dateRange": "30d",
  "includeSubCampaigns": true
}
```

### Auto Like Posts by Keywords

```json
{
  "operation": "autoLike",
  "likeCriteria": "keywords",
  "keywords": "marketing, automation, linkedin",
  "maxLikesPerDay": 50
}
```

## 🎯 Use Cases

### For Recruiters
- Automate connection requests to potential candidates
- Auto-like and comment on relevant industry posts
- Track engagement metrics for recruitment campaigns
- Analyze candidate profiles and engagement patterns

### For Personal Branding
- Boost your best-performing posts
- Automatically engage with industry leaders' content
- Track your LinkedIn growth and engagement metrics
- Export analytics for performance reports

### For Marketing Teams
- Automate social media engagement campaigns
- Track ROI of LinkedIn marketing efforts
- Analyze competitor strategies and performance
- Generate detailed marketing reports

### For Influencers
- Automate engagement to grow your following
- Track post performance and audience insights
- Analyze what content resonates with your audience
- Export data for brand partnership reports

## 🔒 Safety Features

ConnectSafely is designed with safety in mind:
- **Rate Limiting**: Built-in limits to prevent account restrictions
- **Natural Behavior**: Mimics human-like engagement patterns
- **Quality Control**: Filters out low-quality connections and content
- **Compliance**: Follows LinkedIn's terms of service

## 📊 Analytics & Reporting

The analytics nodes provide comprehensive insights:

- **Real-time Metrics**: Track performance as it happens
- **Historical Data**: Analyze trends over time
- **Custom Date Ranges**: Get insights for any time period
- **Export Options**: Download data in multiple formats
- **ROI Tracking**: Calculate return on investment
- **Competitor Analysis**: Benchmark against competitors

## 🛠️ Advanced Configuration

### Custom Targeting
- **Keyword Targeting**: Target posts by specific keywords
- **Creator Targeting**: Focus on specific LinkedIn users
- **Industry Targeting**: Target users by industry
- **Location Targeting**: Geographic targeting options
- **Job Title Targeting**: Target specific roles and positions

### Automation Rules
- **Daily Limits**: Set maximum actions per day
- **Time Windows**: Define when automation should run
- **Quality Filters**: Only engage with high-quality content
- **Blacklist Management**: Avoid specific users or content

## 📚 API Documentation

For detailed API documentation, visit [ConnectSafely.ai/docs](https://connectsafely.ai/docs)

## 🤝 Support

- **Documentation**: [ConnectSafely.ai/docs](https://connectsafely.ai/docs)
- **Support**: [support@connectsafely.ai](mailto:support@connectsafely.ai)
- **Community**: Join our Discord community
- **GitHub Issues**: Report bugs and request features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 🔄 Changelog

### v0.1.0
- Initial release
- ConnectSafely node with post boosting, commenting, and connection management
- LinkedIn Automation node with auto-like, auto-share, and user management
- ConnectSafely Analytics node with comprehensive reporting
- Full API integration with ConnectSafely.ai platform

## ⚠️ Disclaimer

This package is designed to work with ConnectSafely.ai's official API. Please ensure you comply with LinkedIn's Terms of Service and use automation responsibly. ConnectSafely.ai provides safety features to help maintain account health, but users are responsible for their LinkedIn account compliance.

---

**Made with ❤️ by the ConnectSafely team**

[ConnectSafely.ai](https://connectsafely.ai) | [Documentation](https://connectsafely.ai/docs) | [Support](mailto:support@connectsafely.ai)