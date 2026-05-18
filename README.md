# INST377-Final-Project
A site that gives people the opportunity to discover new anime to watch!


# What is my project?
RANime Website
A website that allows you to discover a variety of anime that you may have never heard of before. You are even able to select some filters that allow you to find something right up your alley!
This website was designed to be used on a computer or laptop. Mobile compatability may arrive at a later date!




#Developer Manual

#Dependencies
All dependencies can be found in the package.json file. You can download each file by going to its respective website and running their install files on your device's terminal. 

#Getting Started
The first file you want to look at is the databaseBuilder.ipynb. Since I am more comfortable with Python, I used that file to set up the database. Once you set up a Supabase and create a .env file with the URL and KEY, this file can help you set up your database and filter out some troublesome rows. I would also recommend removing null values here (I ended up doing this later through other code). 

#API
Thanks to the IPython Notebook file creating my Supabase, all of the fetch calls are bringing data from that database. Specific documentation can be found on Supabase's website, but if you are wondering what each of my functions does, look at what the names say for a descriptive gist! Another important thing I did was create cookies for each customer. This served as an ID, so that their watchlist could be saved. 

#Bugs and future development
Originally, I was going to have "pages" on the homescreen for a watchlist, allowing the user to use their keyboard to navigate through the pages. This didn't work as planned, and I was only able to show 5-10 (I avoided any more to avoid cluttering). In the future, I will work on making a convenient watchlist, whether that be through the pages system or its own separate page. 

#Credits
I received my theme from here:
https://www.quackit.com/html/html_editors/scratchpad/?example=/html/templates/navbars/glassmorphic_navbar
