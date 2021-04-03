## Agreement

You are not to publish this code to the public under any circumstance. It is
private, and if found on the web you may be held liable in court. Xiao is
not licensed, meaning her code is completely under copyright. No one is
allowed to use any part of her code under any circumstance unless given
explicit permission from the copyright holder.

I, as the copyright holder, grant you the ability to use it as a reference
point for your projects and allow you to use the code as a learning tool.
You may take ideas and reformat code into another library, but you may not 
simply copy and self-host the code, unless the bot using it is COMPLETELY
PRIVATE. This means it cannot be added to any servers but those of the bot
owner.

If a public bot is found using Xiao's code it will be reported to Discord and
removed.

**Please don't push to the repository.** It will simply be reverted and your
rights to view it will be removed. Git is a powerful tool, so don't try your
luck on this one.

## Installing

> Only Linux-based systems can run Xiao. She will not run on Windows or Mac.

1. Install [Node.js](https://nodejs.org/en/) (you will need **at least v15.0.0**).
2. Run `apt install git` to install git.
3. Clone this repository with `git clone https://github.com/dragonfire535/xiao.git`.
4. Run `cd xiao` to move into the folder that you just created.
5. Create a file named `.env` and fill it out as shown in `.env.example`.
6. Run `apt update` and `apt upgrade` to install the latest dependencies of your distro.
7. Run `apt install python` to install python.
8. Run `apt install ffmpeg` to install ffmpeg.
9. [Follow these instructions to install the dependencies for `node-canvas`](https://github.com/Automattic/node-canvas/wiki/Installation%3A-Ubuntu-and-other-Debian-based-systems).
10. Run `apt install liblqr-1-0-dev liblqr-1-0` to install liblqr (needed for ImageMagick).
11. [Follow these instructions to install ImageMagick](https://www.tecmint.com/install-imagemagick-on-debian-ubuntu/).
12. [Follow these instructions to set up Redis](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04). Remember to set up a password!
13. Run `apt install libtool` so sodium can compile if necessary. **(Optional)**
14. Download [the NSFW model](https://github.com/gantman/nsfw_model) and extract the contents to `<xiao folder>/tf_models/nsfw`.
15. Download DECTalk and extract it to `<xiao folder>/dectalk`. You will have to find this yourself. You need the files `say.exe`, `dectalk.dll`, and `dtalk_us.dic`.
16. Run `apt install wine` to install wine.
17. Run `dpkg --add-architecture i386` to allow installation of wine32.
18. Run `apt update` again.
19. Run `apt install wine32` to install wine32.
20. Run `apt install xvfb` to install xvfb.
21. Run `npm i --production` in the folder you cloned the bot.
22. Run `npx parse-domain-update` to update the domain list for `parse-domain`.
23. Run `npm i -g pm2` to install PM2.
24. Run `pm2 start Xiao.js --name xiao` to run the bot.
