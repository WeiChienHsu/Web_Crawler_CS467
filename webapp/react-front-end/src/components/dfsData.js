export const dfs = {
  url: "https://www.reddit.com/r/OSUOnlineCS/",
  name: "reddit",
  title: "reddit: the front page of the internet",
  nodeSvgShape: {
    shape: "rect",
    shapeProps: {
      width: 130,
      height: 30,
      x: 0,
      y: -20,
      fill: "lightblue"
    }
  },
  children: [
    {
      url:
        "https://www.reddit.com/login/?dest=https%3A%2F%2Fwww.reddit.com%2Fr%2FOSUOnlineCS%2F",
      name: "reddit",
      title: "reddit.com: Log in",
      nodeSvgShape: {
        shape: "rect",
        shapeProps: {
          width: 130,
          height: 30,
          x: 0,
          y: -20,
          fill: "skyblue"
        }
      },
      children: [
        {
          url: "https://www.reddithelp.com/en/categories/using-reddit/",
          name: "reddithelp",
          title: "How to set up two-factor authentication | Reddit Help",
          nodeSvgShape: {
            shape: "rect",
            shapeProps: {
              width: 130,
              height: 30,
              x: 0,
              y: -20,
              fill: "yellow"
            }
          },
          children: [
            {
              url: "https://www.redditinc.com/",
              name: "redditinc",
              title: "Homepage - Reddit",
              nodeSvgShape: {
                shape: "rect",
                shapeProps: {
                  width: 130,
                  height: 30,
                  x: 0,
                  y: -20,
                  fill: "lightgreen"
                }
              },
              children: [
                {
                  url: "https://www.reddit.com/",
                  name: "reddit",
                  title: "reddit: the front page of the internet",
                  children: [
                    {
                      url: "http://redditgifts.com/",
                      name: "redditgifts",
                      title: "reddit gift exchanges and more! - redditgifts",
                      children: [
                        {
                          url: "http://www.redditgifts.com/about/",
                          name: "redditgifts",
                          title: "What is this all about? - redditgifts",
                          children: null
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
