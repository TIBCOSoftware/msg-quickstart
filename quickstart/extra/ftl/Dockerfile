# syntax=docker/dockerfile:1
ARG BASE_IMAGE=redhat/ubi8

FROM ${BASE_IMAGE} AS tars
RUN yum install -y unzip && yum clean all
COPY TIB_ftl_*_linux_x86_64.zip /tmp/pkg.zip
RUN unzip -j /tmp/pkg.zip "*.tar.gz" -d /extract/ && rm /tmp/pkg.zip

FROM ${BASE_IMAGE}
ARG FTL_VERSION=7.3

RUN yum install -y jq && yum clean all

COPY --from=tars /extract/*.tar.gz /tmp/
RUN cd / && \
    for f in /tmp/*.tar.gz; do tar -xzf "$f"; done && \
    rm -f /tmp/*.tar.gz && \
    ln -s /opt/tibco/ftl/${FTL_VERSION}/ /opt/tibco/ftl/current-version

# Destinations for quickstart.topic and performance.topic (with durable_ttl),
# merged into the realm at runtime by the entrypoint.
COPY <<'EOF' /opt/tibco/ftl/etc/quickstart-destinations.json
[
  {
    "name": "quickstart.topic",
    "description": "Quickstart topic used by tibftldest-send / tibftldest-recv samples.",
    "store_name": "ftl.routing.persistent.store",
    "cluster_name": "ftl.forwarding.cluster",
    "properties": {
      "prefetch": 1024,
      "message_ttl": "0",
      "durable_ttl": "300",
      "retention_time": "0",
      "bytelimit": "",
      "message_limit": 0,
      "swap_bytelimit": "",
      "discard": "old",
      "ack_settings": {
        "mode": "async",
        "batch_count": 1000,
        "batch_time": 0.1
      },
      "max_delivery": 0
    },
    "acl": {
      "users": [],
      "roles": []
    }
  },
  {
    "name": "performance.topic",
    "description": "Throughput topic used by tibftldest-thru-send / tibftldest-thru-recv samples.",
    "store_name": "ftl.routing.persistent.store",
    "cluster_name": "ftl.forwarding.cluster",
    "properties": {
      "prefetch": 1024,
      "message_ttl": "0",
      "durable_ttl": "300",
      "retention_time": "0",
      "bytelimit": "",
      "message_limit": 0,
      "swap_bytelimit": "",
      "discard": "old",
      "ack_settings": {
        "mode": "async",
        "batch_count": 1000,
        "batch_time": 0.1
      },
      "max_delivery": 0
    },
    "acl": {
      "users": [],
      "roles": []
    }
  }
]
EOF

ENV PATH=/opt/tibco/ftl/current-version:/opt/tibco/ftl/current-version/bin:/opt/tibco/ftl/current-version/samples/bin:/opt/tibco/ftl/current-version/samples/bin/advanced:$PATH

# Default to preview mode.
ENV TIBFTL_LICENSE="preview_mode"

RUN printf '%s\n' \
    '#!/bin/sh' \
    'set -e' \
    'if [ "${TIBFTL_LICENSE}" = "preview_mode" ]; then' \
    '  if [ -f /license ]; then' \
    '    export TIBFTL_LICENSE=/license' \
    '  elif [ -d /license ]; then' \
    '    lic=$(ls /license/*.bin /license/*.lic 2>/dev/null | head -n1 || true)' \
    '    if [ -n "$lic" ]; then export TIBFTL_LICENSE="$lic"; fi' \
    '  fi' \
    'fi' \
    'case "$1" in tibftlserver|*/tibftlserver)' \
    '  echo "TIBFTL_LICENSE=${TIBFTL_LICENSE}"' \
    '(' \
    '  FTLS_URL="http://localhost:8585"' \
    '  DEST_FILE="/opt/tibco/ftl/etc/quickstart-destinations.json"' \
    '  TMP_REALM="/tmp/realm.json"' \
    '  TMP_NEW="/tmp/realm.new.json"' \
    '  i=0' \
    '  while [ $i -lt 60 ] && ! tibftladmin -a -ftls "$FTLS_URL" >/dev/null 2>&1; do' \
    '    i=$((i+1)); sleep 1' \
    '  done' \
    '  if ! tibftladmin -a -ftls "$FTLS_URL" >/dev/null 2>&1; then' \
    '    echo "quickstart-config: server never became available; skipping destination setup" >&2' \
    '    exit 0' \
    '  fi' \
    '  if ! tibftladmin -dr "$TMP_REALM" -ftls "$FTLS_URL" >/dev/null 2>&1; then' \
    '    echo "quickstart-config: dumprealm failed; skipping destination setup" >&2' \
    '    exit 0' \
    '  fi' \
    '  jq --slurpfile new "$DEST_FILE" '"'"'.destinations = ($new[0] + (.destinations // [] | map(select(.name as $n | ($new[0] | map(.name)) | index($n) | not))))'"'"' "$TMP_REALM" > "$TMP_NEW"' \
    '  if tibftladmin -ur "$TMP_NEW" -ftls "$FTLS_URL" >/dev/null 2>&1; then' \
    '    echo "quickstart-config: applied destinations from $DEST_FILE"' \
    '  else' \
    '    echo "quickstart-config: updaterealm failed" >&2' \
    '  fi' \
    ') & ;; esac' \
    'exec "$@"' \
    > /usr/local/bin/ftl-entrypoint.sh && chmod +x /usr/local/bin/ftl-entrypoint.sh

EXPOSE 8585
VOLUME /data
WORKDIR /opt/tibco/ftl/current-version
ENTRYPOINT ["/usr/local/bin/ftl-entrypoint.sh"]
CMD ["tibftlserver", "-n", "default@0.0.0.0:8585"]

LABEL org.opencontainers.image.title="ftl-quickstart"
LABEL org.opencontainers.image.description="TIBCO FTL Quickstart image"
LABEL org.opencontainers.image.source=""
LABEL com.tibco.ftl.image.ftl-quickstart=""
