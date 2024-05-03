#!/usr/bin/perl
use strict;
use warnings;

# Path to the log file
my $log_file = 'path/to/your/logfile.log';

# Open the file or exit if it fails
open my $fh, '<', $log_file or die "Cannot open $log_file: $!";

# Hash to store error counts
my %error_counts;

# Process each line in the file
while (my $line = <$fh>) {
    # Check for lines that include the word "Error"
    if ($line =~ /Error/) {
        # Extract the error type assuming it follows "Error: "
        if ($line =~ /Error: (\w+)/) {
            my $error_type = $1;
            # Increment the count for this error type
            $error_counts{$error_type}++;
        }
    }
}

# Close the file handle
close $fh;

# Print the results
foreach my $error (sort keys %error_counts) {
    print "Error type '$error' occurred $error_counts{$error} times.\n";
}
