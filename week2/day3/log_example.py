import logging

age = int(input())
if age<0:
    logging.error("age should be poisitive")
elif age>18:
    logging.info("you are eligible for voting")
else:
    logging.warning("you are not eligible for voting")