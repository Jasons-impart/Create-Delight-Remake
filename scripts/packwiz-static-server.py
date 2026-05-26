import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format: str, *args) -> None:
        return


class PackwizStaticServer(ThreadingHTTPServer):
    daemon_threads = True
    request_queue_size = 512


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("port", type=int)
    parser.add_argument("root")
    args = parser.parse_args()

    handler = partial(QuietHandler, directory=args.root)
    server = PackwizStaticServer(("127.0.0.1", args.port), handler)
    try:
        server.serve_forever()
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
