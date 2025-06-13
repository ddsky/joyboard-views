To define a view you have some required and some optional fields.

#### Required
`name`: The name of your view should be brief and descriptive

`url`: The URL where the content of the view can be found

`utf8_icon`: An icon symbolizing the view's purpose. You can find icons at [utf8-icons.com](https://utf8-icons.com/) for example

`image_icon`: An icon symbolizing the view's purpose. The image icon can be either a link to an image or a base64 encoded image. You need only one, either `utf8_icon` or `image_icon`. If both are present, `image_icon` wins.

#### Optional
`description`: Describing what the user can expect to see. How will it bring them value and joy?

`modification`: An object containing at least one of `include_xpaths`, `exclude_xpaths`, or `css`. These will be applied to the `url`. For example, if the `url` points to a website, you can remove certain elements via `remove_xpaths` to make the view look nicer.

`requirements`: A list of features the user's joyboard needs to have in order to properly make use of the view. The following requirements are available: 
 * `video`: The display needs to be able to playback video.
 * `touch`: The display must support touch controls.
 * `microphone`: The display must have a microphone.
 * `speakers`: The display must have speakers.

`settings`: The settings block allow you to capture user settings via the admin UI. These settings will then be sent via query parameters to the `url`. For example, if you want users for the view to specify how many items should be shown you could use:
```json
{
  "key": "count",
  "label": "Number of Items",
  "type": "number"
}
```
This is then added via `&count=123` to the `url`, e.g. `https://myserver.com/joyview?count=123`. Each setting must have a `key` (should be lowercase and contain no special characters), a human readable `label` which is shown to the user, and a `type` (must be one of `text`, `number`, `select`).

#### Here's a full example:
```json
{
    "name": "My Joyview",
    "description": "Showing something that brings joy.",
    "url": "https://myserver.com/joyview",
    "modification": {
      "include_xpaths": [],
      "exclude_xpaths": ["//div[@id='foot']"],
      "css": "color:blue"
    },
    "utf8_icon": "🌳",
    "image_icon": "https://myserver.com/joyview/icon.png",
    "requirements": ["video", "touch"],
    "settings": [
      {
        "key": "headline",
        "label": "Headline",
        "placeholder": "Type your headline...",
        "type": "text"
      },
      {
        "key": "count",
        "label": "Number of Items",
        "type": "number"
      },
      {
        "key": "choice",
        "label": "Select one",
        "options": ["Love", "Happiness"],
        "type": "select"
      }
    ]
  }
```
