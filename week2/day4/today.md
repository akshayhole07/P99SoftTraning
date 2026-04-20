1. ddl
2. dml
3. dcl
4. tcl

5. snowflake - cloud data platform
- data warehouse as a service (DWaaS)
- multi-cluster shared data architecture
- supports structured and semi-structured data
- built-in security and governance features
- pay-as-you-go pricing model
- supports SQL and other programming languages

7. create and replace commands uses in snowflake- create or replace table: creates a new table or replaces an existing table with the same name

8. Alter table command in snowflake is used to modify the structure of an existing table, such as adding or dropping columns, changing data types, or renaming the table. It allows you to make changes to the table without having to recreate it. example:
ALTER TABLE table_name ADD column_name data_type;   
ALTER TABLE table_name DROP COLUMN column_name;
ALTER TABLE table_name RENAME TO new_table_name;

9. use CHECK constraint at the time of ddl not use it with alter .
   we can use it later for adding other constraint like Foreign Key , Not Null ...

10. joins 
    -select from 2 to 3 table using joins

11. window function
    - use window function to get the cumulative sum of a column in a table
  syntax:
  SELECT column_name, 
         SUM(column_name) OVER (ORDER BY column_name) AS cumulative_sum
  FROM table_name;

  explanation:
- The SELECT statement retrieves the specified column and calculates the cumulative sum using the SUM() function.   

   a. rank() function
     - use rank() function to assign a rank to each row in a result set based on the values of a specific column.

   b. percent_rank() function
    - use percent_rank() function to calculate the relative rank of each row in a result set as a percentage of the total number of rows.
    example:
    SELECT column_name, 
         RANK() OVER (ORDER BY column_name) AS rank,
         PERCENT_RANK() OVER (ORDER BY column_name) AS percent_rank
    FROM table_name;


   c. lead- use lead() function to access data from the next row in a result set without using a self-join.
     example:    
     SELECT column_name, 
         LEAD(column_name) OVER (ORDER BY column_name) AS next_value
     FROM table_name;

   d. lag- use lag() function to access data from the previous row in a result set without using a self-join.
     example:    
    SELECT column_name, 
         LAG(column_name) OVER (ORDER BY column_name) AS previous_value 
    FROM table_name;    

    e. row_number() function
     - use row_number() function to assign a unique sequential integer to rows within a partition of a result set, starting at 1 for the first row in each partition.
     example:
     SELECT column_name, 
         ROW_NUMBER() OVER (ORDER BY column_name) AS row_num
     FROM table_name;
    
    f. dense_rank() function
     - use dense_rank() function to assign a rank to each row in a result set based on the values of a specific column, with no gaps in the ranking sequence.
     example:
     SELECT column_name, 
         DENSE_RANK() OVER (ORDER BY column_name) AS dense_rank
     FROM table_name;


