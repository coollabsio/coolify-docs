---
title: "Raspberry Pi OS Setup Guide"
description: "Install Coolify on Raspberry Pi with 64-bit OS setup guide covering Pi Zero 2 W, Pi 3, 4, and 5 models with SSH configuration."
---

# Raspberry Pi OS Setup Guide
## Prerequisites

To run Coolify on a Raspberry Pi, you will need one of the following Raspberry Pi models:
  - Raspberry Pi Zero 2 W
  - Raspberry Pi 400
  - Raspberry Pi 3 (all models)
  - Raspberry Pi 4 (all models)
  - Raspberry Pi 5 (all models)

## Installation

1. Download and install the [Raspberry Pi Imager](https://www.raspberrypi.com/software/) on your computer.

2. Insert your microSD card into your computer's card reader.

3. Open Raspberry Pi Imager and select your device:
   - Click `Choose Device`
   - Select your Raspberry Pi model

4. Select the Operating System:
   - Click `Choose OS`
   - Navigate to `Raspberry Pi OS (other)`
   - Select `Raspberry Pi OS Lite (64-bit)`

   ::: warning Caution
   You must select one of the 64-bit OS versions as Coolify is not compatible with 32-bit versions.
   :::

   ::: info Note
   While you can use the full desktop version `Raspberry Pi OS (64-bit)`/`Raspberry Pi OS Full (64-bit)` or even `Ubuntu`, we recommend the `Raspberry Pi OS Lite` version as it uses fewer resources.
   :::

5. Choose your Storage:
   - Click `Choose Storage`
   - Select your microSD card
   - Double-check you've selected the correct drive to avoid data loss

6. Click `Next` and select `Edit settings` for OS Customization.
   - Navigate to `Services` and enable SSH with a public key.

   ::: warning Caution
   The SSH key must not have a passphrase or 2FA enabled, otherwise you will not be able to complete the onboarding process.
   :::

   - Configure other options as needed

7. Finish the installation onto the SD card.

8. Once complete, insert the microSD card into your Raspberry Pi and power it on.

9. After your Raspberry Pi boots up, proceed with the [Coolify installation](/get-started/installation#quick-installation-recommended).
