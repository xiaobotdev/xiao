## Agreement

If you self-host this you're nuts.

## Installing

> Only Linux-based systems can run Xiao. She will not run on Windows or Mac.

1. Install [Node.js](https://nodejs.org/en/) (you will need **at least v15.0.0**).
2. Run `apt install git` to install git.
3. Clone this repository with `git clone https://github.com/dragonfire535/xiao.git`.
4. Run `cd xiao` to move into the folder that you just created.
5. Create a file named `.env` and fill it out as shown in `.env.example`.
6. Run `apt update` and `apt upgrade` to install the latest dependencies of your distro.
7. Run `apt install ffmpeg` to install ffmpeg.
8. [Follow these instructions to install the dependencies for `node-canvas`](https://github.com/Automattic/node-canvas/wiki/Installation%3A-Ubuntu-and-other-Debian-based-systems).
9. Run `apt install liblqr-1-0-dev liblqr-1-0` to install liblqr (needed for ImageMagick).
10. [Follow these instructions to install ImageMagick](https://www.tecmint.com/install-imagemagick-on-debian-ubuntu/).
11. [Follow these instructions to set up Redis](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04). Remember to set up a password!
12. Run `apt install libtool` so sodium can compile if necessary. **(Optional)**
13. Download [the NSFW model](https://github.com/gantman/nsfw_model) and extract the contents to `<xiao folder>/tf_models/nsfw`.
14. Run `apt install wine` to install wine.
15. Run `dpkg --add-architecture i386` to allow installation of wine32.
16. Run `apt update` again.
17. Run `apt install wine32` to install wine32.
18. Run `apt install xvfb` to install xvfb.
19. Run `npm i --omit=dev` in the folder you cloned the bot.
20. Run `npx parse-domain-update` to update the domain list for `parse-domain`.
21. Run `npm i -g pm2` to install PM2.
22. Run `pm2 start Xiao.js --name xiao` to run the bot.
