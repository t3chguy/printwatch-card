# Changelog

All notable changes to this project will be documented in this file.

## [1.0.10] - 2024-01-30

* Fixed camera aspect ratio, thanks [CasperVerswijvelt](https://github.com/CasperVerswijvelt)
* Adjusted background color of printer status
* Added overflow for long file name
* Ability to remove Aux Fan from YAML to have the icon hide on the card
* If printer is turned off hide the broken image from the card and handle request errors more gracefully. **You will need to add `online_entity: binary_sensor.p1s_online` to your YAML file**
* Adding percent complete


## [1.0.9] - 2024-01-29

* Improved layout of AMS filament
* Highlight filament in use
* Improve status of print labeling

## [1.0.8] - 2024-01-29

* Complete development workflow refactor

## [1.0.7] - 2024-01-29

* Removing all hard coded colors

## [1.0.6] - 2024-01-28

* Removing GCode Preview since it doesn't work in LAN only mode (hopefully we can find a way to get it back)

## [1.0.5] - 2024-01-28

* Fixed list of printer status's to better align with what we expect from Bambu printers
* Fixed light toggle
* Fixed pause/resume/stop

## [1.0.4] - 2024-01-28

* Added external spool support
* Added ability to change name of printer
* Added circled to better highlight light filament
* Hiding printing UI when not printing
* Adding theme support (aka dark mode)


## [1.0.0] - 2024-01-28

### Initial Release

#### Features
- Live camera feed with print status overlay
- Real-time temperature monitoring (bed and nozzle)
- Print progress tracking with layer count
- Estimated completion time calculation
- AMS/Material status visualization
- Chamber light and auxiliary fan controls
- Print control buttons (pause/resume/stop) with confirmation dialogs
- Speed profile monitoring
- Print preview image
- Local API support

#### Technical Features
- Custom card editor for easy configuration
- Automatic camera feed refresh
- Responsive design
- Confirmation dialogs for critical actions
- Real-time updates for all printer stats