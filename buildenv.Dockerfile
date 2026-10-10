FROM ubuntu:24.04
SHELL ["/bin/bash", "-e", "-o", "pipefail", "-c"]
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        cmake \
        net-tools \
        ca-certificates \
        git \
        curl \
    && rm -rf /var/lib/apt/lists/*

ARG USERNAME
ARG USER_UID
ARG USER_GID

RUN : "${USERNAME:?USERNAME is required}" \
    && : "${USER_UID:?USER_UID is required}" \
    && : "${USER_GID:?USER_GID is required}" \
    && userdel -r ubuntu \
    && if getent group ubuntu >/dev/null; then groupdel ubuntu; fi \
    && groupadd --gid "$USER_GID" "$USERNAME" \
    && useradd \
        --uid "$USER_UID" \
        --gid "$USER_GID" \
        --create-home \
        --shell /bin/bash \
        "$USERNAME"

USER $USERNAME

ENV HOME=/home/$USERNAME
WORKDIR $HOME

ARG NVM_VERSION=v0.40.8
ENV NVM_DIR=$HOME/.nvm
RUN curl -fsSL "https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_VERSION}/install.sh" | bash

ARG NODE_VERSION=v24
RUN source "$NVM_DIR/nvm.sh" \
    && nvm install "$NODE_VERSION" \
    && nvm alias default "$NODE_VERSION" 

RUN source "$NVM_DIR/nvm.sh" \
    && nvm use default \
    && npm install -g @moonrepo/cli

ENTRYPOINT ["bash", "-c", "source $NVM_DIR/nvm.sh && exec \"$@\"", "--"]
CMD ["/bin/bash"]