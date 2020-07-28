#Load libraries
library(readr)
library(metafor)
library(RCurl)

my_data <- read.csv("./test/data.csv", dec = ",")

effect_sizes <- escalc(n1i = n_controls, n2i = n_patients, m1i = mean_controls, m2i = mean_patients, 
    sd1i = sd_controls, sd2i = sd_patients, data = my_data, measure = "SMD", APPEND=TRUE)

summary_table <- summary(effect_sizes)[,c("study", "yi", "ci.lb", "ci.ub")]
ma_model <- rma(yi, vi, data = effect_sizes)
#forest(ma_model, slab = paste(my_data$study, as.character(my_data$year), sep = ", "))

est <- ma_model[[2]][[1]]
lci <- ma_model[[6]]
uci <- ma_model[[7]]

summary_estimate <- data.frame("Overall", est, lci, uci)
names(summary_estimate) <- c("study", "yi", "ci.lb", "ci.ub")

final_data <- rbind(as.data.frame(summary_table), summary_estimate)
cat(format_csv(final_data))