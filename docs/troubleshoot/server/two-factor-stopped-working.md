---
title: 2FA Stopped Working
description: Fix two-factor authentication failures in Coolify by synchronizing server time with NTP, checking systemd-timesyncd, and configuring firewall port 123 access.
---

# 2FA Stopped Working
It is usually a time synchronization issue.

## Diagnosis
- Check your server's time with `date` - if the time is off, you need to synchronize it.
- Check your NTP configuration with `cat /etc/ntp.conf`.
- Check with `systemctl status systemd-timesyncd.service` if your operating system is using systemd to synchronize time.
- Check your firewall (`ufw`, `iptables`) rules to see if you have any rules that block time synchronization ports (`123/udp, 123/tcp`).

## Solution
- If your operating system is using systemd, you can synchronize the time with `sudo timedatectl set-ntp true`.
- If your operating system is not using systemd, you can synchronize the time with `sudo ntpdate ntp.ubuntu.com`.