import csv
import os

#CAREFUL, THIS CREATES A ~1.6 GB CSV FILE 
#creates a csv in current_directory/../2019-Oct/ with only entries containing electronics.smartphone as category
#csv input file path: current_directory/../2019-Oct/2019-Oct.csv

category = 'furniture.living_room.sofa' #keep consistent with other files
dir = os.path.dirname(__file__)
i = 0
j = 0

replaced_category = category.replace('.', '-')
output_file_name = '2019-Oct-' + replaced_category + '.csv'

with open(os.path.join(dir, '..','2019-Oct','2019-Oct.csv'), 'r') as inputfile, open(os.path.join(dir, '..','2019-Oct', output_file_name), 'w', newline='') as outputfile:
    writer = csv.writer(outputfile)
    for row in csv.reader(inputfile):
        #since this process takes a while the following lines create an output every 1mil rows to show the program didn't crash
        #remove these lines if that is not necessary
        #i += 1
        #if i % 1000000 == 0:
        #    j += 1
        #    print(j)
        #end of output part
        if (row[4].startswith(category)):
            writer.writerow(row)
