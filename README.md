# n8n-nodes-connectsafely-ai
<div align="center">
  <img src="screenshots/n8n-connect-connectsafely.png" alt="ConnectSafely in N8N" />
</div>
This is an n8n community node that provides comprehensive LinkedIn automation through ConnectSafely.ai in your `n8n` workflows.

**ConnectSafely.ai** is a LinkedIn automation platform that provides safe and compliant tools for automating LinkedIn engagement, post management, and profile analysis. This single node combines all LinkedIn automation features into one powerful, easy-to-use interface.

If you've been trying to automate LinkedIn tasks like `social media engagement`, `lead generation`, `profile analysis`, or `content management` with `n8n` and want to avoid dealing with LinkedIn's complex API restrictions, the `n8n-nodes-connectsafely-ai` will make your life easier.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.



![ConnectSafely LinkedIn Node](screenshots/allnodes.png)

This package includes one comprehensive LinkedIn automation node with all features:

## Table of Contents

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)

## Highlights

* **Single Node Solution**: One node for all LinkedIn automation needs
* **12 Operations**: Complete LinkedIn automation toolkit
* **Safe & Compliant**: Built-in rate limiting and compliance features
* **Profile Analysis**: Lead generation and contact extraction
* **Post Management**: Engagement, commenting, and content scraping
* **Connection Automation**: Smart networking and relationship building
* **Real-time Data**: Live relationship tracking and profile insights
* **No Authentication Required**: Public post scraping without login  

## Installation

1. Sign up at [ConnectSafely.ai](https://connectsafely.ai) and get your API key
2. Visit your n8n instance > Settings > Community Nodes > Install `n8n-nodes-connectsafely-ai`
3. Set up ConnectSafely credentials with your API key
4. Add the ConnectSafely LinkedIn node to your workflow by searching for `connectsafely`
5. Start automating LinkedIn in your n8n workflows!

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### LinkedIn Actions (4 operations)
* **Follow User**: Follow or unfollow LinkedIn users
* **Send Message**: Send direct messages to LinkedIn users
* **Send Connection Request**: Send connection requests with custom messages
* **Check Relationship Status**: Check relationship status with other users

### LinkedIn Posts (7 operations)
* **Get Latest Posts**: Get the latest posts from LinkedIn users
* **React to Post**: React to posts with various reaction types (Like, Praise, etc.)
* **Comment on Post**: Comment on LinkedIn posts
* **Get Post Comments**: Retrieve comments from posts with pagination
* **Get All Post Comments**: Get all comments from a post with automatic pagination
* **Search Posts**: Search for posts by keywords with filters
* **Scrape Post Content**: Scrape public post content without authentication

### LinkedIn Profiles (1 operation)
* **Fetch Profile**: Fetch detailed profile information with geo location and contact data

## Credentials

This node requires a ConnectSafely.ai `API key` to connect to your ConnectSafely account.

<div align="center">
  <img src="screenshots/add-cred.png" alt="ConnectSafely in N8N" />
</div>

## Compatibility

This node was developed on `n8n@1.0.0`. It hasn't been tested on other versions yet.

## Usage

1. Add the **ConnectSafely LinkedIn** node to your workflow
2. Select your **ConnectSafely API** credentials
3. Choose your desired **operation** from the dropdown (12 available operations)
4. Configure the operation-specific parameters
5. Execute your workflow to automate LinkedIn actions

### Quick Start Guide

The node dynamically shows only the relevant parameters based on your selected operation:

- **Actions Operations**: Configure profile IDs, messages, and connection details
- **Posts Operations**: Set up post URLs, reactions, comments, and search criteria  
- **Profile Operations**: Specify profile IDs and data inclusion options


## Anti-Bot Detection

With strong support from ConnectSafely.ai, you can implement robust anti-bot detection using the following features:

* **Rate Limiting**: Built-in limits to prevent account restrictions
* **Natural Behavior**: Mimics human-like engagement patterns
* **Quality Control**: Filters out low-quality connections and content
* **Compliance**: Follows LinkedIn's terms of service

## Resources

* [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/#community-nodes)
* [ConnectSafely.ai Homepage](https://connectsafely.ai)
* [ConnectSafely.ai API Documentation](https://connectsafely.ai/n8n-docs)
* [ConnectSafely.ai Support](mailto:support@connectsafely.ai)

## Version History

* `0.1.0` **Initial Release** - ConnectSafely LinkedIn comprehensive automation node:
  * **LinkedIn Actions (4 operations)**: Follow users, send messages, connection requests, relationship checking
  * **LinkedIn Posts (7 operations)**: Post management, reactions, comments, search, and content scraping
  * **LinkedIn Profiles (1 operation)**: Profile analysis with geo location and contact data
  * **Single Node Solution**: All 12 operations in one unified interface
  * **Full API Integration**: Complete ConnectSafely.ai platform integration
  * **Smart Parameter Display**: Dynamic UI showing only relevant parameters per operation

## About

Comprehensive n8n node for LinkedIn automation through ConnectSafely.ai platform.

### Topics

linkedin-automation  social-media-automation  connectsafely  n8n  n8n-nodes  n8n-community-node-package  lead-generation  profile-analysis  post-management  connection-automation  content-scraping

---

**Made with ❤️ by the ConnectSafely team**

[ConnectSafely.ai](https://connectsafely.ai) | [Documentation](https://connectsafely.ai/n8n-docs) | [YouTube](https://www.youtube.com/@ConnectSafelyAI-v2x) | [Support](mailto:support@connectsafely.ai)