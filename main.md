Use the full response labels from the Latest Description in BR_0003/TR_0003,
Version 2.2. Do not use the raw Field6 values and do not use the Previous
Version labels.

500/12532 -> Failed - CDRRequest Failure (500/12532)
500/12533 -> Failed - CDRRequest Failure (500/12533)
500/12535 -> Failed - CD Certificate Generation failure (500/12535)
500/12536 -> Failed - CD Certificate Generation failure (500/12536)
500/12537 -> Failed - Filenet Storage failure (500/12537)
500/12538 -> Failed - Filenet Storage failure (500/12538)
500/12539 -> Failed - CrossChannelRenewal (500/12539)
206/12511 -> Failed - UMPEmail not sent (206/12511)
500/1000 -> Failed (Other)
200 OK -> Success (200)
ELSE -> NULL


Do not use raw response values and do not silently use the old aggregation
labels.

The STTM contains a version conflict:
- BR_0003/TR_0003 Version 2.2 generates the latest response labels.
- BR_0007/TR_0007 Version 1.4 still filters on older labels.

For preview only, align the six existing aggregation rows to the Version 2.2
response labels for:
- 500/12532
- 500/12533
- 500/12535
- 500/12536
- 500/12537
- 500/12538
- plus Success (200).

Mark the cd_successfailure aggregation as BLOCKED pending business confirmation
of whether these additional Version 2.2 outcomes must also be included:
- 500/12539: Failed - CrossChannelRenewal (500/12539)
- 206/12511: Failed - UMPEmail not sent (206/12511)
- 500/1000: Failed (Other)

Do not write the aggregation SQL until this conflict is resolved.
