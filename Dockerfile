FROM node 
MAINTAINER Manglu Balasubramanian "bmangalaganesh@au1.ibm.com"

# Install the application
ADD package.json /app/package.json
ADD server /app/server
ADD public /app/public
ADD anz_mortgages.xlsx /app/anz_mortgages.xlsx

RUN cd /app && npm install

ENV WEB_PORT 80
EXPOSE  80

# Vulnerability Advisor : uninstall openssh-server
# RUN apt-get --purge remove openssh-server

# Vulnerability Advisor : Fix PASS_MAX_DAYS, PASS_MIN_DAYS and PASS_MIN_LEN, common-password
RUN mv -f /etc/login.defs /etc/login.defs.orig
RUN sed 's/^PASS_MAX_DAYS.*/PASS_MAX_DAYS 90/' /etc/login.defs.orig > /etc/login.defs
RUN grep -q '^PASS_MIN_DAYS' /etc/login.defs && sed -i 's/^PASS_MIN_DAYS.*/PASS_MIN_DAYS 1/' /etc/login.defs || echo 'PASS_MIN_DAYS 1\n' >> /etc/login.defs
RUN grep -q '^PASS_MIN_LEN' /etc/login.defs && sed -i 's/^PASS_MIN_LEN.*/PASS_MIN_LEN 8/' /etc/login.defs || echo 'PASS_MIN_LEN 9\n' >> /etc/login.defs
RUN grep -q '^password.*required' /etc/pam.d/common-password && sed -i 's/^password.*required.*/password    required            pam_permit.so minlen=9/' /etc/pam.d/common-password || echo 'password    required            pam_permit.so minlen=9' >> /etc/pam.d/common-password

# Vulnerability Advisor : Temporarily remove a specific <package> that was discovered vulnerable
# RUN dpkg --purge --force-all <package>

# Address a current vulnerability in public node image by removing offending package
RUN dpkg --purge --force-all libgcrypt20 

#Set the working directory to app
WORKDIR /app

# Define command to run the application when the container starts
CMD ["node", "server/app.js"] 

