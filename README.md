# Todoist New Tab

A Chrome extension that replaces your new tab page with Todoist, helping you stay productive by keeping your tasks front and center.

## Features

- Opens Todoist in every new tab
- Two implementation options:
  - Simple iframe embedding (works with existing Todoist login)
  - API implementation (requires API token but offers direct integration)
- Clean, distraction-free interface
- Customizable through extension options

## Installation

### From Chrome Web Store

1. Visit [Todoist New Tab on the Chrome Web Store](https://chrome.google.com/webstore/detail/todoist-new-tab/your-extension-id)
2. Click "Add to Chrome"

### Manual Installation

1. Clone this repository or download the ZIP file
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The extension is now installed and will replace your new tab page with Todoist

## Configuration

1. Click the extension icon or right-click and select "Options"
2. Choose your preferred implementation method:
   - **Iframe**: Simple embedding of the Todoist web app (recommended for most users)
   - **API**: Direct integration with Todoist API (requires API token)
3. If using the API implementation, enter your Todoist API token
   - You can find your API token in [Todoist Settings > Integrations](https://todoist.com/app/settings/integrations) (scroll to the bottom)
4. Click "Save Options"

## Development

### Setup

1. Clone the repository
